import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('medical-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat rekam medis baru' })
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil semua rekam medis' })
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  // Route spesifik HARUS di atas route dinamis (:id)
  @Get('by-patient/:patientId')
  @ApiOperation({ summary: 'Mengambil rekam medis berdasarkan ID pasien' })
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.medicalRecordsService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil rekam medis berdasarkan ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicalRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui rekam medis' }) 
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus rekam medis' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicalRecordsService.remove(id);
  }
}