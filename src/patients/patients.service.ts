import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryPatientDto } from './dto/query-patient.dto';
import { contains } from 'class-validator';

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

  async findAll(query: QueryPatientDto) {
    const { page = 1, limit = 10, nama, nik } = query;
    const skip = (page - 1) * limit;

    // Membuat kondisi filter secara dinamis
    const where: any = {};
    if (nama) {
      where.nama = { contains: nama };
    }
    if (nik) {
      where.nik = { contains: nik};
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: {createdAt: 'desc'},
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
