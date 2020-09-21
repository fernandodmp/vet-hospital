import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { Doctor } from './doctor.entity';
import * as fs from 'fs';
import * as util from 'util';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { doc } from 'prettier';

@Injectable()
export class DoctorsRepository {
  file: string;

  doctors: Doctor[];

  constructor() {
    this.file = `${__dirname}/../../data/doctors.json`;
    this.doctors = JSON.parse(fs.readFileSync(this.file).toString());
  }

  async save() {
    const writeFile = util.promisify(fs.writeFile);
    try {
      await writeFile(this.file, JSON.stringify(this.doctors));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { nome, especialidade } = createDoctorDto;
    const doctor = new Doctor(this.doctors.length + 1, nome, especialidade);
    this.doctors.push(doctor);

    try {
      this.save();
    } catch (error) {
      this.doctors.pop();
      throw new InternalServerErrorException();
    }

    return doctor;
  }

  findAll() {
    return this.doctors;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctorIndex = this.doctors.findIndex(doctor => doctor.id === id);
    if (doctorIndex === -1) {
      throw new NotFoundException();
    }

    if (updateDoctorDto.nome) {
      this.doctors[doctorIndex].nome = updateDoctorDto.nome;
    }

    if (updateDoctorDto.especialidade) {
      this.doctors[doctorIndex].especialidade = updateDoctorDto.especialidade;
    }

    try {
      await this.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return this.doctors[doctorIndex];
  }
}
