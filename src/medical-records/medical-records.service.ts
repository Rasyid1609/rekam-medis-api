import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalRecordDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException(`Pasien dengan id ${dto.patientId} tidak ditemukan`);
    return this.prisma.medicalRecord.create({ data: dto });
  }

  findAll() {
    return this.prisma.medicalRecord.findMany({ include: { patient: true } });
  }

  async findOne(id: number) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!record) throw new NotFoundException(`Rekam medis dengan id ${id} tidak ditemukan`);
    return record;
  }

  async update(id: number, dto: UpdateMedicalRecordDto) {
    await this.findOne(id);
    return this.prisma.medicalRecord.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.medicalRecord.delete({ where: { id } });
  }

  findByPatient(patientId: number) {
    return this.prisma.medicalRecord.findMany({ where: { patientId } });
  }
}
