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

export class CierreSemestreDto {
  cursoId: number;
  asignaturaId: number;
  semestreId: number;
  estudiantes: {
    estudianteId: number;
    notaFinalParcial: number | null;
    notaFinalTarea: number | null;
    notaFinal: number | null;
  }[];
}
export class CierreSemestrePreBasicaDto {
  cursoId: number;
  asignaturaId: number;
  semestreId: number;
  estudiantes: {
    estudianteId: number;
    conceptoFinalParcial: number | null;
  }[];
}
