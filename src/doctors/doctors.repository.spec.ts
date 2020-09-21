import { DoctorsRepository } from './doctors.repository';
import IOUTils from '../utils/IOUtils';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('../utils/IOUtils.ts');

const doctorDto: CreateDoctorDto = {
  nome: 'Fernando',
  especialidade: 'Cardiologista',
};

describe('DoctorsRepository', () => {
  let doctorsRepository: DoctorsRepository;

  beforeEach(() => {
    doctorsRepository = new DoctorsRepository();
    doctorsRepository.doctors = [];
    doctorsRepository.doctorsLastId = 0;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should save the files', async () => {
      const spy = jest.spyOn(IOUTils, 'save');

      await doctorsRepository.create({
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });
      expect(spy).toBeCalledTimes(2);
    });

    it('should throw error if save fails', async () => {
      jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(doctorsRepository.create(doctorDto)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('should undo creation if save fails', async () => {
      jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(doctorsRepository.create(doctorDto)).rejects.toThrow();

      expect(doctorsRepository.findAll()).toHaveLength(0);
    });

    it('should create a new doctor', async () => {
      const result = await doctorsRepository.create(doctorDto);
      expect(result).toEqual({
        especialidade: 'Cardiologista',
        id: 1,
        nome: 'Fernando',
      });
    });

    it('should increase the id', async () => {
      await doctorsRepository.create({
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });

      expect(doctorsRepository.doctorsLastId).toEqual(1);
    });
  });

  describe('findAll', () => {
    it('should return all of the doctors', async () => {
      await doctorsRepository.create(doctorDto);

      await doctorsRepository.create({
        nome: 'Joao',
        especialidade: 'Ortopedia',
      });

      const result = doctorsRepository.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should save', async () => {
      const spy = jest.spyOn(IOUTils, 'save');
      await doctorsRepository.create(doctorDto);

      await doctorsRepository.update(1, { nome: 'Fernando' });

      expect(spy).toBeCalledTimes(3);
    });

    it('should undo update if save fails', async () => {
      await doctorsRepository.create(doctorDto);

      jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(doctorsRepository.update(1, { nome: 'Jonatan' })).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(doctorsRepository.findDoctor(1)).toEqual({
        id: 1,
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });
    });

    it('should update doctor name', async () => {
      await doctorsRepository.create(doctorDto);

      const result = await doctorsRepository.update(1, { nome: 'Fernando' });

      expect(result.nome).toEqual('Fernando');
    });

    it('should update doctor specialization', async () => {
      await doctorsRepository.create(doctorDto);

      const result = await doctorsRepository.update(1, {
        especialidade: 'Odontologista',
      });

      expect(result.especialidade).toEqual('Odontologista');
    });

    it('should update doctor name and specialization', async () => {
      await doctorsRepository.create({
        nome: 'Fernand',
        especialidade: 'Odontologia',
      });

      const result = await doctorsRepository.update(1, doctorDto);

      expect(result).toEqual({
        id: 1,
        nome: 'Fernando',
        especialidade: 'Odontologia',
      });
    });

    it('should send a 404', async () => {
      expect(doctorsRepository.update(1, { nome: 'Teste' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      await doctorsRepository.create(doctorDto);

      await doctorsRepository.delete(1);

      expect(doctorsRepository.findAll()).toHaveLength(0);
    });

    it('should undo deletion if save fails', async () => {
      await doctorsRepository.create(doctorDto);

      jest.spyOn(IOUTils, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(doctorsRepository.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(doctorsRepository.findDoctor(1)).toEqual({
        id: 1,
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });
    });

    it('should save', async () => {
      const spy = jest.spyOn(IOUTils, 'save');
      await doctorsRepository.create({
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });

      await doctorsRepository.delete(1);

      expect(spy).toBeCalledTimes(3);
    });

    it('should send a 404', async () => {
      expect(doctorsRepository.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findDoctor', () => {
    it('should return the doctor', async () => {
      await doctorsRepository.create(doctorDto);

      const result = doctorsRepository.findDoctor(1);
      expect(result).toEqual({
        id: 1,
        nome: 'Fernando',
        especialidade: 'Cardiologista',
      });
    });

    it('should throw 404', async () => {
      expect(() => doctorsRepository.findDoctor(1)).toThrow(NotFoundException);
    });
  });
});
