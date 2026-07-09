import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryPatientDto {
    @ApiPropertyOptional({ example: 1, description: 'Halaman ke berapa' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: 'Jumlah data per halaman' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'Budi', description: 'Cari berdasarkan nama pasien' })
    @IsOptional()
    @IsString()
    nama?: string;

    @ApiPropertyOptional({ example: '3201', description: 'Cari berdasarkan NIK' })
    @IsOptional()
    @IsString()
    nik?: string;
}