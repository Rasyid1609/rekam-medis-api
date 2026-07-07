import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    nama!: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'DOKTER', enum: ['ADMIN', 'DOKTER'] })
    @IsOptional()
    @IsIn(['ADMIN', 'DOKTER'])
    role?: string;
}