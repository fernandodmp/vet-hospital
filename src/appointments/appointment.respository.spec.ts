import IOUTils from '../utils/IOUtils';
import { AppointmentsRepository } from './appointment.repository';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppointmentStatus } from './appointment.entity';

jest.mock('../utils/IOUtils.ts');

const dogAppointmentDto = {
  nome: 'Apolo',
  raca: 'SRD',
  especie: 'Cachorro',
  atendimento: 'Ortopedia',
  urgencia: false,
};

describe('AppointmentsRpository', () => {
  let appointmentsRepository: AppointmentsRepository;

  beforeEach(() => {
    appointmentsRepository = new AppointmentsRepository();
    appointmentsRepository.appointments = [];
    appointmentsRepository.appointmentsLastId = 0;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should save the files', async () => {
      const spy = jest.spyOn(IOUTils, 'save');

      await appointmentsRepository.create(dogAppointmentDto);
      expect(spy).toBeCalledTimes(2);
    });

    it('should undo creation if save fails', async () => {
      const spy = jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        appointmentsRepository.create(dogAppointmentDto),
      ).rejects.toThrow();

      expect(appointmentsRepository.findAll()).toHaveLength(0);
    });

    it('should create a new appointment', async () => {
      const result = await appointmentsRepository.create(dogAppointmentDto);

      expect(result).toEqual({
        nome: 'Apolo',
        raca: 'SRD',
        especie: 'Cachorro',
        atendimento: 'Ortopedia',
        urgencia: false,
        status: 'PENDENTE',
        id: 1,
      });
    });

    it('should increase the id', async () => {
      await appointmentsRepository.create({
        nome: 'Apolo',
        raca: 'SRD',
        especie: 'Cachorro',
        atendimento: 'Ortopedia',
        urgencia: false,
      });

      expect(appointmentsRepository.appointmentsLastId).toEqual(1);
    });
  });

  describe('findAll', () => {
    it('should find all appointments', async () => {
      await appointmentsRepository.create(dogAppointmentDto);

      const result = appointmentsRepository.findAll();
      expect(result).toEqual([
        {
          nome: 'Apolo',
          raca: 'SRD',
          especie: 'Cachorro',
          atendimento: 'Ortopedia',
          urgencia: false,
          status: 'PENDENTE',
          id: 1,
        },
      ]);
    });

    describe('update', () => {
      it('should save', async () => {
        const spy = jest.spyOn(IOUTils, 'save');
        await appointmentsRepository.create(dogAppointmentDto);

        await appointmentsRepository.update(1, {
          status: AppointmentStatus.CANCELADO,
        });

        expect(spy).toBeCalledTimes(3);
      });

      it('should undo update if save fails', async () => {
        await appointmentsRepository.create(dogAppointmentDto);

        jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
          throw new Error();
        });

        expect(
          appointmentsRepository.update(1, {
            status: AppointmentStatus.CANCELADO,
          }),
        ).rejects.toThrow(InternalServerErrorException);

        expect(appointmentsRepository.findOne(1).status).toEqual(
          AppointmentStatus.PENDENTE,
        );
      });

      it('should update appointment status to CANCELADO', async () => {
        await appointmentsRepository.create(dogAppointmentDto);

        const result = await appointmentsRepository.update(1, {
          status: AppointmentStatus.CANCELADO,
        });

        expect(result.status).toEqual(AppointmentStatus.CANCELADO);
      });

      it('should update appointment status to ATENDIDO', async () => {
        await appointmentsRepository.create(dogAppointmentDto);

        const result = await appointmentsRepository.update(1, {
          status: AppointmentStatus.ATENDIDO,
        });

        expect(result.status).toEqual(AppointmentStatus.ATENDIDO);
      });

      it('should send a 404', async () => {
        expect(
          appointmentsRepository.update(1, {
            status: AppointmentStatus.CANCELADO,
          }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('findOne', () => {
      it('should return the appointment', async () => {
        await appointmentsRepository.create(dogAppointmentDto);

        const result = appointmentsRepository.findOne(1);
        expect(result).toEqual({
          nome: 'Apolo',
          raca: 'SRD',
          especie: 'Cachorro',
          atendimento: 'Ortopedia',
          urgencia: false,
          status: 'PENDENTE',
          id: 1,
        });
      });

      it('should throw 404', async () => {
        expect(() => appointmentsRepository.findOne(1)).toThrow(
          NotFoundException,
        );
      });
    });

    describe('findOpen', () => {
      it('should only return appointments with status PENDENTE', () => {
        const result = appointmentsRepository.findOpen();
        const filteredResult = result.filter(
          appointment => appointment.status !== AppointmentStatus.PENDENTE,
        );
        expect(filteredResult).toHaveLength(0);
      });
    });
  });
});
