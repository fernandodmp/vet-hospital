import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentsRepository } from './appointment.repository';
import { NotFoundException } from '@nestjs/common';
import { DoctorsModule } from '../doctors/doctors.module';
import { Appointment, AppointmentStatus } from './appointment.entity';

const UrgentDog: Appointment = {
  id: 3,
  nome: 'Apolo',
  especie: 'Cachorro',
  raca: 'SRD',
  atendimento: 'Ortopedia',
  urgencia: true,
  status: AppointmentStatus.PENDENTE,
};

const nonUrgentDog: Appointment = {
  id: 3,
  nome: 'Apolo',
  especie: 'Cachorro',
  raca: 'SRD',
  atendimento: 'Ortopedia',
  urgencia: false,
  status: AppointmentStatus.PENDENTE,
};

const nonUrgentCat: Appointment = {
  id: 3,
  nome: 'Hades',
  especie: 'Gato',
  raca: 'SRD',
  atendimento: 'Ortopedia',
  urgencia: false,
  status: AppointmentStatus.PENDENTE,
};

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;
  let doctorsService: DoctorsService;
  let appointmentsRepository: AppointmentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DoctorsModule],
      providers: [AppointmentsService, AppointmentsRepository],
    }).compile();

    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
    doctorsService = module.get<DoctorsService>(DoctorsService);

    appointmentsRepository = module.get<AppointmentsRepository>(
      AppointmentsRepository,
    );
  });

  describe('findDoctorNextAppointment', () => {
    it('should 404', () => {
      jest.spyOn(doctorsService, 'findDoctor').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      expect(() => appointmentsService.findDoctorNextAppointment(1)).toThrow(
        NotFoundException,
      );
    });

    it('should return first appointment on the queue', () => {
      jest.spyOn(doctorsService, 'findDoctor').mockImplementationOnce(() => {
        return {
          nome: 'Fernando',
          especialidade: 'Ortopedia',
          id: 1,
        };
      });

      jest.spyOn(appointmentsRepository, 'findOpen').mockImplementation(() => {
        return [nonUrgentCat, nonUrgentDog];
      });

      const result = appointmentsService.findDoctorNextAppointment(1);
      expect(result).toEqual(nonUrgentCat);
    });

    it('should return first urgent appointment on the queue', () => {
      jest.spyOn(doctorsService, 'findDoctor').mockImplementationOnce(() => {
        return {
          nome: 'Fernando',
          especialidade: 'Ortopedia',
          id: 1,
        };
      });

      jest.spyOn(appointmentsRepository, 'findOpen').mockImplementation(() => {
        return [nonUrgentCat, nonUrgentDog, UrgentDog];
      });

      const result = appointmentsService.findDoctorNextAppointment(1);
      expect(result).toEqual(UrgentDog);
    });
  });
});
