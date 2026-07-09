// src/patients/patients.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        { provide: PatientsService, useValue: mockPatientsService },
      ],
    })
      // Guard butuh dependency (JwtService, Reflector, dll) yang tidak relevan
      // untuk unit test controller, jadi kita override supaya selalu lolos.
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto and return the result', async () => {
      const dto = {
        nama: 'Budi',
        nik: '1234567890123456',
        tanggalLahir: '2000-01-15',
      };
      const mockResult = { id: 1, ...dto };
      mockPatientsService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto as any);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with the query and return the result', async () => {
      const query = { page: 1, limit: 10 };
      const mockResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockPatientsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query as any);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the parsed id and return the result', async () => {
      const mockPatient = { id: 1, nama: 'Budi' };
      mockPatientsService.findOne.mockResolvedValue(mockPatient);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPatient);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto, and return the result', async () => {
      const dto = { nama: 'Budi Updated' };
      const mockResult = { id: 1, ...dto };
      mockPatientsService.update.mockResolvedValue(mockResult);

      const result = await controller.update(1, dto as any);

      expect(result).toEqual(mockResult);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the parsed id and return the result', async () => {
      const mockPatient = { id: 1, nama: 'Budi' };
      mockPatientsService.remove.mockResolvedValue(mockPatient);

      const result = await controller.remove(1);

      expect(result).toEqual(mockPatient);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});