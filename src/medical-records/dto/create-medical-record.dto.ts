import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMedicalRecordDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    patientId!: number;

    @ApiProperty({ example: 'Pasien merasa sakit kepala' })
    @IsString()
    @IsNotEmpty()
    keluhan!: string;

    @ApiProperty({ example: 'Migrain' })
    @IsString()
    @IsNotEmpty()
    diagnosis!: string;

    @ApiProperty({ example: 'Pemberian obat analgesik' })
    @IsOptional()
    @IsString()
    tindakan?: string;

    @ApiProperty({ example: 'Dr. John Doe' })
    @IsString()
    @IsNotEmpty()
    dokter!: string;

}
