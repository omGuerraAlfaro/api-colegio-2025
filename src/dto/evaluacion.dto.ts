export class CreateEvaluacionDto {
  readonly nombreEvaluacion: string;
  readonly cursoId: number;
  readonly asignaturaId: number;
  readonly semestreId: number;
  readonly tipoEvaluacionId: number;
}

export class UpdateEvaluacionDto {
  readonly nombreEvaluacion?: string;
}
