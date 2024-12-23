export class CreateAsistenciaDto {
    estudianteId: number;
    cursoId: number;
    semestreId: number;
    calendarioId: number;
    estado: boolean;
}

export class UpdateAsistenciaDto {
    asistenciaId: number;
    estado: boolean;
}
