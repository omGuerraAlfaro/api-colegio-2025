export class CreateCierreSemestreDto {
    estudianteId: number;
    anio: number;
    semestre: number;
    nota_final?: number;
    asistencia_final?: number;
}

export class CreateCierreSemestreDto2 {
    semestreId: number;
}