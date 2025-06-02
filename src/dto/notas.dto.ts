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

export class findNotasAlumnoDto {
    estudianteId: number;
    semestreId: number;
    cursoId: number;
}

export class findNotasCursoDto {
    cursoId: number;
    semestreId: number;
}

export class findNotasCursoAsignaturaDto {
    cursoId: number;
    semestreId: number;
    asignaturaId: number;
}