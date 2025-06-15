import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCierreSemestreDto, CreateCierreSemestreDto2 } from "src/dto/CreateCierreSemestreDto";
import { CierreSemestre } from "src/models/CierreSemestre.entity";
import { Estudiante } from "src/models/Estudiante.entity";
import { Repository } from "typeorm";
import { NotasService } from "../Notas/notas.service";
import { Curso } from "src/models/Curso.entity";
import { Semestre } from "src/models/Semestre.entity";
import { AsistenciaService } from "../Asistencia/asistencia.service";

@Injectable()
export class CierreSemestreService {
    constructor(
        @InjectRepository(CierreSemestre)
        private cierreRepo: Repository<CierreSemestre>,
        @InjectRepository(Estudiante)
        private estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Curso)
        private readonly cursoRepo: Repository<Curso>,
        @InjectRepository(Semestre)
        private semestreRepo: Repository<Semestre>,
        private readonly notasService: NotasService,
        private readonly asistenciaService: AsistenciaService,
    ) { }

    async crear(semestreId: number): Promise<void> {
        console.log('Crear cierre semestre con ID de semestre:', semestreId);

        const notasFinales = await this.notasService.getPromedioFinalPorEstudianteYCurso(semestreId);

        for (const resultado of notasFinales) {
            const { estudianteId, cursoId, promedioFinal, conceptoFinal } = resultado;

            const estudiante = await this.estudianteRepo.findOneBy({ id: estudianteId });
            const curso = await this.cursoRepo.findOneBy({ id: cursoId });
            const asistenciaResumen = await this.asistenciaService.getAsistenciasResumenPorSemestre(semestreId);
            const asistenciaFinal = asistenciaResumen.find((item: any) => item.estudianteId === estudianteId);

            console.log('Asistencia final:', asistenciaFinal);

            if (!estudiante || !curso) {
                console.warn(`Estudiante o curso no encontrado: estudiante ${estudianteId}, curso ${cursoId}`);
                continue;
            }

            const cierre = this.cierreRepo.create({
                anio: new Date().getFullYear(),
                semestre: semestreId,
                nota_final: promedioFinal,
                concepto_final: conceptoFinal,
                asistencia_final: Math.round(asistenciaFinal?.porcentajeAsistencia) ?? 0,
                estudiante,
                curso,
            });

            await this.cierreRepo.save(cierre);
        }

        // ✅ Cerrar el semestre después de procesar todos los cierres
        await this.semestreRepo.update({ id_semestre: semestreId }, { semestreCerrado: true });

        console.log(`Semestre ${semestreId} marcado como cerrado.`);
    }

    async obtenerPorEstudiante(estudianteId: number): Promise<CierreSemestre[]> {
        return this.cierreRepo.find({ where: { estudiante: { id: estudianteId } } });
    }

    async obtenerPorEstudianteySemestre(estudianteId: number, semestreId: number): Promise<CierreSemestre[]> {
        return this.cierreRepo.find({ where: { estudiante: { id: estudianteId }, semestre: semestreId } });
    }
}