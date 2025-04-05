export class CreateNotasDto {
    cursoId: number;
    asignaturaId: number;
    semestreId: number;
    notas: {
        estudianteId: number;
        evaluacionId: number;
        nota: number | null;
        fecha: Date;
    }[];
}
