import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CierreSemestre } from "src/models/CierreSemestre.entity";
import { Estudiante } from "src/models/Estudiante.entity";
import { Repository } from "typeorm";
import { NotasService } from "../Notas/notas.service";
import { Curso } from "src/models/Curso.entity";
import { Semestre } from "src/models/Semestre.entity";
import { AsistenciaService } from "../Asistencia/asistencia.service";
import { CierreObservacionAlumno } from "src/models/CierreObservacionAlumno";

@Injectable()
export class CierreSemestreService {
    constructor(
        @InjectRepository(CierreSemestre)
        private cierreRepo: Repository<CierreSemestre>,
        @InjectRepository(CierreObservacionAlumno)
        private cierreObsRepo: Repository<CierreObservacionAlumno>,
        @InjectRepository(Estudiante)
        private estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Curso)
        private readonly cursoRepo: Repository<Curso>,
        @InjectRepository(Semestre)
        private semestreRepo: Repository<Semestre>,
        private readonly notasService: NotasService,
        private readonly asistenciaService: AsistenciaService,
    ) { }

    // --- CIERRA UN SEMESTRE ESPECÍFICO (1 o 2) CON DATOS BASE (notas/asistencia) ---
    async crear(semestreId: number): Promise<void> {
        console.log('Crear cierre semestre con ID de semestre:', semestreId);

        const notasFinales = await this.notasService.getPromedioFinalPorEstudianteYCurso(semestreId) as any[];
        const asistenciaResumen = await this.asistenciaService.getAsistenciasResumenPorSemestre(semestreId) as any[];

        for (const resultado of notasFinales) {
            const { estudianteId, cursoId, promedioFinal, conceptoFinal } = resultado;

            const estudiante = await this.estudianteRepo.findOneBy({ id: estudianteId });
            const curso = await this.cursoRepo.findOneBy({ id: cursoId });
            if (!estudiante || !curso) {
                console.warn(`Estudiante o curso no encontrado: estudiante ${estudianteId}, curso ${cursoId}`);
                continue;
            }

            // Buscar asistencia: por curso si hay cursoId en el resumen, si no por estudiante
            const asistenciaItem =
                asistenciaResumen.find(a => a.estudianteId === estudianteId && (a.cursoId ? a.cursoId === cursoId : true)) ??
                asistenciaResumen.find(a => a.estudianteId === estudianteId);

            const asistenciaFinal = Math.round(asistenciaItem?.porcentajeAsistencia ?? 0);

            const esPreBasica = this.esPreBasica(curso.id);
            const conceptoNormalizado = this.normalizeConcept(conceptoFinal);

            const cierre = this.cierreRepo.create({
                anio: new Date().getFullYear(),
                semestre: semestreId,
                // En pre-básica: solo concepto (PL/ML/L); en básica/media: solo nota
                nota_final: esPreBasica ? null : promedioFinal,
                concepto_final: esPreBasica ? conceptoNormalizado : null,
                asistencia_final: asistenciaFinal,
                estudiante: { id: estudiante.id } as Estudiante,
                curso: { id: curso.id } as Curso,
            });

            await this.cierreRepo.save(cierre);
        }

        await this.semestreRepo.update({ id_semestre: semestreId }, { semestreCerrado: true });
        console.log(`Semestre ${semestreId} marcado como cerrado.`);
    }

    // --- GENERA CIERRE ANUAL (semestre = 4) LEYENDO S1 y S2 DESDE cierre_semestre ---
    // Regla: pre-básica (cursos 1 y 2) guarda SOLO concepto (PL/ML/L); básica/media guarda SOLO nota.
    async crearCierreAnual({
        semestreAnualId = 4,
        semestresFuente = [1, 2],
        anio = new Date().getFullYear(),
    }: {
        semestreAnualId?: number;
        semestresFuente?: [number, number];
        anio?: number;
    }): Promise<void> {
        const [s1, s2] = semestresFuente;
        console.log(`Crear cierre anual para año ${anio}, semestre ID ${semestreAnualId}, desde S${s1} y S${s2}`);

        try {
            await this.cierreRepo.manager.transaction(async (em) => {
                const cierreRepo = em.getRepository(CierreSemestre);
                const semestreRepo = em.getRepository(Semestre);

                const [cierresS1, cierresS2, existentesS3] = await Promise.all([
                    cierreRepo.find({ where: { anio, semestre: s1 }, relations: ['estudiante', 'curso'] }),
                    cierreRepo.find({ where: { anio, semestre: s2 }, relations: ['estudiante', 'curso'] }),
                    cierreRepo.find({ where: { anio, semestre: semestreAnualId }, relations: ['estudiante', 'curso'] }),
                ]);

                console.log(`Cierres encontrados -> S${s1}: ${cierresS1.length}, S${s2}: ${cierresS2.length}, S${semestreAnualId} existentes: ${existentesS3.length}`);

                const key = (eId: number, cId: number) => `${eId}::${cId}`;
                const s1Map = new Map<string, CierreSemestre>();
                const s2Map = new Map<string, CierreSemestre>();
                const s3Map = new Map<string, CierreSemestre>();

                for (const c of cierresS1) s1Map.set(key(c.estudiante.id, c.curso.id), c);
                for (const c of cierresS2) s2Map.set(key(c.estudiante.id, c.curso.id), c);
                for (const c of existentesS3) s3Map.set(key(c.estudiante.id, c.curso.id), c);

                const allKeys = new Set<string>([...s1Map.keys(), ...s2Map.keys()]);
                console.log(`Total combinaciones estudiante-curso a procesar: ${allKeys.size}`);

                const toSave: CierreSemestre[] = [];

                for (const k of allKeys) {
                    const cS1 = s1Map.get(k);
                    const cS2 = s2Map.get(k);
                    const base = cS2 ?? cS1;
                    if (!base) continue;

                    const estudianteId = base.estudiante.id;
                    const cursoId = base.curso.id;
                    const esPreBasica = this.esPreBasica(cursoId);

                    // Nota anual (solo básica/media)
                    let notaAnual: number | null = null;
                    if (!esPreBasica) {
                        const notas: number[] = [];
                        if (cS1?.nota_final != null) notas.push(Number(cS1.nota_final));
                        if (cS2?.nota_final != null) notas.push(Number(cS2.nota_final));
                        notaAnual = notas.length ? this.round1(this.avg(notas)) : null;
                    }

                    // Concepto anual (solo pre-básica: PL/ML/L promediado ordinalmente)
                    let conceptoAnual: string | null = null;
                    if (esPreBasica) {
                        const conceptos = [
                            this.normalizeConcept(cS1?.concepto_final),
                            this.normalizeConcept(cS2?.concepto_final),
                        ].filter(Boolean) as string[];
                        conceptoAnual = conceptos.length ? this.promedioConcepto(conceptos) : null;
                    }

                    // Asistencia anual (ambos niveles)
                    const asistVals: number[] = [];
                    if (cS1?.asistencia_final != null) asistVals.push(Number(cS1.asistencia_final));
                    if (cS2?.asistencia_final != null) asistVals.push(Number(cS2.asistencia_final));
                    const asistenciaAnual = asistVals.length ? Math.round(this.avg(asistVals)) : 0;

                    const existente = s3Map.get(k);
                    if (existente) {
                        existente.nota_final = esPreBasica ? null : notaAnual;
                        existente.concepto_final = esPreBasica ? conceptoAnual : null;
                        existente.asistencia_final = asistenciaAnual;
                        toSave.push(existente);
                    } else {
                        toSave.push(
                            cierreRepo.create({
                                anio,
                                semestre: semestreAnualId,
                                nota_final: esPreBasica ? null : notaAnual,
                                concepto_final: esPreBasica ? conceptoAnual : null,
                                asistencia_final: asistenciaAnual,
                                estudiante: { id: estudianteId } as Estudiante,
                                curso: { id: cursoId } as Curso,
                            }),
                        );
                    }
                }

                if (toSave.length) {
                    console.log(`Guardando ${toSave.length} registros en S${semestreAnualId}...`);
                    await cierreRepo.save(toSave);
                } else {
                    console.warn('No hay registros a insertar/actualizar para el cierre anual.');
                }

                await semestreRepo.update({ id_semestre: semestreAnualId }, { semestreCerrado: true });
            });

            console.log(`Cierre anual generado y semestre ${semestreAnualId} marcado como cerrado.`);
        } catch (error: any) {
            console.error('Error en crearCierreAnual:', {
                message: error?.message,
                code: error?.code,
                detail: error?.driverError?.detail,
            });
            throw new InternalServerErrorException('Error al generar el cierre anual.');
        }
    }

    // --- QUERIES ---
    async obtenerPorEstudiante(estudianteId: number) {
        return this.cierreRepo.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['curso', 'estudiante'],
            order: { anio: 'DESC', semestre: 'ASC' },
        });
    }

    async obtenerPorEstudianteySemestre(estudianteId: number, semestreId: number) {
        return this.cierreRepo.find({
            where: { estudiante: { id: estudianteId }, semestre: semestreId },
            relations: ['curso', 'estudiante'],
        });
    }

    async obtenerCierreAnualPorEstudiante(estudianteId: number) {
        return this.obtenerPorEstudianteySemestre(estudianteId, 3);
    }

    // --- HELPERS ---
    private avg(nums: number[]): number {
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    private round1(n: number): number {
        return Math.round(n * 10) / 10;
    }

    private esPreBasica(cursoId: number): boolean {
        return cursoId === 1 || cursoId === 2;
    }

    // Normaliza a PL/ML/L estrictamente; cualquier otro valor -> null
    private normalizeConcept(concepto?: string | null): 'PL' | 'ML' | 'L' | null {
        if (!concepto) return null;
        const up = concepto.toString().trim().toUpperCase();
        if (up === 'PL' || up === 'ML' || up === 'L') return up as 'PL' | 'ML' | 'L';
        return null;
    }

    // Promedia conceptos pre-básica (PL/ML/L) por escala ordinal y mapea de vuelta; si no hay válidos -> null
    private promedioConcepto(conceptos: string[]): 'PL' | 'ML' | 'L' | null {
        const score: Record<'PL' | 'ML' | 'L', number> = { PL: 1, ML: 2, L: 3 };
        const inv: Record<number, 'PL' | 'ML' | 'L'> = { 1: 'PL', 2: 'ML', 3: 'L' };
        const vals = conceptos
            .map(c => this.normalizeConcept(c))
            .filter((v): v is 'PL' | 'ML' | 'L' => !!v)
            .map(v => score[v]);

        if (!vals.length) return null;
        const r = Math.max(1, Math.min(3, Math.round(this.avg(vals))));
        return inv[r];
    }

    // --- OBSERVACIONES ---
    async crearCierreObservacionMultiple(cierres: { estudianteId: number; observacion: string }[]) {
        const cierresEntities = this.cierreObsRepo.create(
            cierres.map(c => ({
                estudiante: { id: c.estudianteId } as Estudiante,
                observacion: c.observacion,
            })),
        );
        await this.cierreObsRepo.save(cierresEntities);
    }

    async obtenerObservacionesPorEstudiante(estudianteId: number) {
        return this.cierreObsRepo.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['estudiante'],
            order: { id: 'DESC' },
        });
    }

}
