import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        ...dto,
        tanggalLahir: new Date(dto.tanggalLahir),
      },
    });
  }

  findAll() {
    return this.prisma.patient.findMany();
  }

  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { medicalRecords: true },
    });
    if (!patient) throw new NotFoundException(`Pasien dengan id ${id} tidak ditemukan`);
    return patient;
  }

  async update(id: number, dto: UpdatePatientDto) {
    await this.findOne(id);
    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        tanggalLahir: dto.tanggalLahir ? new Date(dto.tanggalLahir) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
