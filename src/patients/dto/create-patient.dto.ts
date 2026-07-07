import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePatientDto {
    @ApiProperty({ example: 'Ahmad' })
    @IsString()
    @IsNotEmpty()
    nama!: string;

    @ApiProperty({ example: '1234567890123456' })
    @IsString()
    @IsNotEmpty()
    nik!: string;

    @ApiProperty({ example: '1990-01-01' })
    @IsDateString()
    tanggalLahir!: string;

    @ApiProperty({ example: 'Laki-laki' })
    @IsIn(['Laki-laki', 'Perempuan'])
    jenisKelamin!: string;

    @ApiProperty({ example: 'Madiun, Jawa Timur' })
    @IsOptional()
    @IsString()
    alamat?: string;
}
