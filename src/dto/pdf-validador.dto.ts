export class CreatePdfValidadorDto {
    readonly certificateType?: string;
    readonly certificateNumber?: string;
    readonly validationCode: string;
    readonly isValid?: boolean;
    readonly validatedAt?: Date;
}
export class UpdatePdfValidadorDto {
    readonly certificateType?: string;
    readonly certificateNumber?: string;
    readonly validationCode?: string;
    readonly isValid?: boolean;
    readonly validatedAt?: Date;
}
