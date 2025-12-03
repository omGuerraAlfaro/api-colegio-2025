import { IsInt, IsPositive, IsOptional } from 'class-validator';

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
    semestreId?: number;
    cursoId: number;
}

export class findNotasCursoDto {
    @IsInt({ message: 'cursoId debe ser un número entero' })
    @IsPositive({ message: 'cursoId debe ser un número positivo' })
    cursoId: number;

    @IsOptional()
    @IsInt({ message: 'semestreId debe ser un número entero' })
    semestreId?: number;
}

export class findNotasCursoAsignaturaDto {
    cursoId: number;
    semestreId: number;
    asignaturaId: number;
}