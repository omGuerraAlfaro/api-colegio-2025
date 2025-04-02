export class CreateNotasDto {
    cursoId: number;
    notas: {
        estudianteId: number;
        evaluacionId: number;
        nota: number | null;
        fecha: Date;
    }[];
}
