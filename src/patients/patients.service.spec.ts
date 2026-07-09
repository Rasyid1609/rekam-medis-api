import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PatientsService', () => {
  let service: PatientsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    patient: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a patient and convert tanggalLahir to Date', async () => {
      const dto = {
        nama: 'Budi',
        nik: '1234567890123456',
        tanggalLahir: '2000-01-15', // dikirim sebagai string, seperti dari JSON body
      };
      const mockCreated = { id: 1, ...dto, tanggalLahir: new Date(dto.tanggalLahir) };
      mockPrismaService.patient.create.mockResolvedValue(mockCreated);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockCreated);
      expect(prisma.patient.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          tanggalLahir: new Date(dto.tanggalLahir),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated data with default page & limit', async () => {
      const mockPatients = [{ id: 1, nama: 'Budi' }];
      mockPrismaService.patient.findMany.mockResolvedValue(mockPatients);
      mockPrismaService.patient.count.mockResolvedValue(1);

      const result = await service.findAll({} as any);

      expect(prisma.patient.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        data: mockPatients,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply filter by nama and nik, and calculate skip correctly', async () => {
      mockPrismaService.patient.findMany.mockResolvedValue([]);
      mockPrismaService.patient.count.mockResolvedValue(0);

      await service.findAll({
        page: 2,
        limit: 5,
        nama: 'Budi',
        nik: '123',
      } as any);

      expect(prisma.patient.findMany).toHaveBeenCalledWith({
        where: {
          nama: { contains: 'Budi' },
          nik: { contains: '123' },
        },
        skip: 5, // (page - 1) * limit = (2-1)*5
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should calculate totalPages correctly', async () => {
      mockPrismaService.patient.findMany.mockResolvedValue([]);
      mockPrismaService.patient.count.mockResolvedValue(23);

      const result = await service.findAll({ page: 1, limit: 10 } as any);

      expect(result.meta.totalPages).toBe(3); // Math.ceil(23 / 10)
    });
  });

  describe('findOne', () => {
    it('should return a patient with medicalRecords included', async () => {
      const mockPatient = { id: 1, nama: 'Budi', medicalRecords: [] };
      mockPrismaService.patient.findUnique.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPatient);
      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { medicalRecords: true },
      });
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Pasien dengan id 999 tidak ditemukan',
      );
    });
  });

  describe('update', () => {
    it('should update a patient and convert tanggalLahir if provided', async () => {
      const existingPatient = { id: 1, nama: 'Budi', medicalRecords: [] };
      mockPrismaService.patient.findUnique.mockResolvedValue(existingPatient);

      const dto = { nama: 'Budi Updated', tanggalLahir: '1999-05-05' };
      const mockUpdated = { id: 1, ...dto, tanggalLahir: new Date(dto.tanggalLahir) };
      mockPrismaService.patient.update.mockResolvedValue(mockUpdated);

      const result = await service.update(1, dto as any);

      expect(result).toEqual(mockUpdated);
      expect(prisma.patient.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...dto,
          tanggalLahir: new Date(dto.tanggalLahir),
        },
      });
    });

    it('should leave tanggalLahir as undefined if not provided in dto', async () => {
      const existingPatient = { id: 1, nama: 'Budi', medicalRecords: [] };
      mockPrismaService.patient.findUnique.mockResolvedValue(existingPatient);
      mockPrismaService.patient.update.mockResolvedValue({ id: 1, nama: 'Budi Updated' });

      const dto = { nama: 'Budi Updated' };
      await service.update(1, dto as any);

      expect(prisma.patient.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          nama: 'Budi Updated',
          tanggalLahir: undefined,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent patient', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, { nama: 'X' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.patient.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a patient if it exists', async () => {
      const mockPatient = { id: 1, nama: 'Budi', medicalRecords: [] };
      mockPrismaService.patient.findUnique.mockResolvedValue(mockPatient);
      mockPrismaService.patient.delete.mockResolvedValue(mockPatient);

      const result = await service.remove(1);

      expect(result).toEqual(mockPatient);
      expect(prisma.patient.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when deleting non-existent patient', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prisma.patient.delete).not.toHaveBeenCalled();
    });
  });
});