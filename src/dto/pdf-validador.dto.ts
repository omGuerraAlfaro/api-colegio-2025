export class CreatePdfValidadorDto {
    readonly certificateType?: string;
    readonly certificateNumber?: string;
    readonly validationCode: string;
    readonly isValid?: boolean;
    readonly validatedAt?: Date;
    readonly primerNombreAlumno?: string;
    readonly segundoNombreAlumno?: string;
    readonly primerApellidoAlumno?: string;
    readonly segundoApellidoAlumno?: string;
    readonly curso?: number;
    readonly rut?: string;
    readonly dv?: string;
    readonly isErp?: boolean;
}
export class UpdatePdfValidadorDto {
    readonly certificateType?: string;
    readonly certificateNumber?: string;
    readonly validationCode?: string;
    readonly isValid?: boolean;
    readonly validatedAt?: Date;
}
