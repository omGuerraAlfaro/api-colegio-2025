import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAsistenciaDto, UpdateAsistenciaDto } from 'src/dto/asistencia.dto';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Asistencia } from 'src/models/Asistencia.entity';
import { CalendarioAsistencia } from 'src/models/CalendarioAsistencia';
import { Curso } from 'src/models/Curso.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { Semestre } from 'src/models/Semestre.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class AsistenciaService {
    constructor(
        @InjectRepository(Asistencia)
        private readonly asistenciaRepository: Repository<Asistencia>,
        @InjectRepository(CalendarioAsistencia)
        private readonly calendarioAsistenciaRepository: Repository<CalendarioAsistencia>,
    ) { }

    async getAllFechasCalendarioAsistencia(): Promise<CalendarioAsistencia[]> {
        const fechas = await this.calendarioAsistenciaRepository.find();
        return fechas;
    }

    async getAsistenciaByCursoAndSemestre(cursoId: number, semestreId: number): Promise<any[]> {
        try {
            const resultados = await this.asistenciaRepository
                .createQueryBuilder('asistencia')
                .innerJoinAndSelect('asistencia.estudiante', 'estudiante')
                .innerJoinAndSelect('asistencia.curso', 'curso')
                .innerJoinAndSelect('asistencia.semestre', 'semestre')
                .innerJoinAndSelect('asistencia.calendario', 'calendario')
                .where('curso.id = :cursoId', { cursoId })
                .andWhere('semestre.id_semestre = :semestreId', { semestreId })
                .andWhere('estudiante.estado_estudiante = :estado', { estado: true })
                .select([
                    'estudiante.id AS estudianteId',
                    `CONCAT(estudiante.primer_nombre_alumno, ' ', estudiante.primer_apellido_alumno, ' ', estudiante.segundo_apellido_alumno) AS nombreCompleto`,
                    'JSON_ARRAYAGG(JSON_OBJECT("fecha", calendario.fecha, "estado", asistencia.estado)) AS asistencias',
                ])
                .groupBy('estudiante.id')
                .orderBy('estudiante.primer_nombre_alumno', 'ASC')
                .getRawMany();

            // Convertir asistencias (string) a objetos JSON
            return resultados.map((resultado) => ({
                estudianteId: resultado.estudianteId,
                nombreCompleto: resultado.nombreCompleto,
                asistencias: JSON.parse(resultado.asistencias), // Convertimos a objeto JSON
            }));
        } catch (error) {
            console.error('Error fetching asistencia data:', error);
            throw new Error('Unable to fetch asistencia data. Please check the input parameters and try again.');
        }
    }

    async createAsistencia(dto: CreateAsistenciaDto): Promise<Asistencia> {
        try {
            const estudiante = new Estudiante();
            estudiante.id = dto.estudianteId;

            const curso = new Curso();
            curso.id = dto.cursoId;

            const semestre = new Semestre();
            semestre.id_semestre = dto.semestreId;

            const calendario = new CalendarioAsistencia();
            calendario.id_dia = dto.calendarioId;

            const nuevaAsistencia = this.asistenciaRepository.create({
                estudiante,
                curso,
                semestre,
                calendario,
                estado: dto.estado,
            });

            return await this.asistenciaRepository.save(nuevaAsistencia);
        } catch (error) {
            console.error('Error creating asistencia:', error);
            throw new Error('Unable to create asistencia. Please check the input data and try again.');
        }
    }

    async updateAsistencia(dto: UpdateAsistenciaDto): Promise<Asistencia> {
        try {
            const asistencia = await this.asistenciaRepository.findOne({
                where: { id_asistencia: dto.asistenciaId },
            });

            if (!asistencia) {
                throw new Error(`Asistencia with ID ${dto.asistenciaId} not found.`);
            }

            asistencia.estado = dto.estado;

            return await this.asistenciaRepository.save(asistencia);
        } catch (error) {
            console.error('Error updating asistencia:', error);
            throw new Error('Unable to update asistencia. Please check the input data and try again.');
        }
    }

    async createAsistenciasForAllStudents(semestreId: number): Promise<string> {
        try {
            // Obtener el rango de fechas del semestre
            const semestre = await this.calendarioAsistenciaRepository.query(
                `SELECT fecha_inicio, fecha_fin FROM semestres WHERE id_semestre = ?`, 
                [semestreId]
            );
    
            if (!semestre.length) {
                throw new Error('Semestre no encontrado.');
            }
    
            const { fecha_inicio, fecha_fin } = semestre[0];
    
            // Obtener las fechas del calendario dentro del rango del semestre
            const calendario = await this.calendarioAsistenciaRepository.find({
                where: { fecha: Between(fecha_inicio, fecha_fin) },
            });
    
            if (!calendario.length) {
                throw new Error('No se encontraron fechas en el calendario dentro del semestre especificado.');
            }
    
            // Obtener estudiantes y sus cursos relacionados desde la tabla estudiante_curso
            const estudiantesCursos = await this.asistenciaRepository.query(
                `SELECT estudiante.id AS estudianteId, estudiante_curso.curso_id AS cursoId
                 FROM estudiante estudiante
                 INNER JOIN estudiante_curso ON estudiante.id = estudiante_curso.estudiante_id
                 WHERE estudiante.estado_estudiante = true`
            );
    
            if (!estudiantesCursos.length) {
                throw new Error('No se encontraron estudiantes activos relacionados a cursos.');
            }
    
            // Generar las asistencias
            const asistencias = estudiantesCursos.flatMap((estudiante) => 
                calendario.map((fecha) => ({
                    estudiante: { id: estudiante.estudianteId },
                    curso: { id: estudiante.cursoId },
                    semestre: { id_semestre: semestreId },
                    calendario: { id_dia: fecha.id_dia },
                    estado: false, // Estado inicial
                }))
            );
    
            // Guardar las asistencias en la base de datos de forma masiva
            await this.asistenciaRepository.save(asistencias);
    
            return 'Asistencias creadas exitosamente para todos los estudiantes.';
        } catch (error) {
            console.error('Error creando asistencias:', error);
            throw new Error('Error al crear las asistencias. Por favor verifica los datos e intenta nuevamente.');
        }
    }
    
    


}
