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

@Injectable()
export class DoctorsRepository {
  dataPath: string;
  indexesFile: string;

  doctorsLastId: number;
  doctors: Doctor[];

  constructor() {
    this.dataPath = `${__dirname}/../../data`;
    this.doctors = JSON.parse(
      fs.readFileSync(this.dataPath + '/doctors.json').toString(),
    );
    this.doctorsLastId = JSON.parse(
      fs.readFileSync(this.dataPath + '/doctorsId.json').toString(),
    ).id;
  }

  async save() {
    const writeFile = util.promisify(fs.writeFile);
    try {
      await writeFile(
        this.dataPath + '/doctors.json',
        JSON.stringify(this.doctors),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async saveLastId() {
    const writeFile = util.promisify(fs.writeFile);
    try {
      await writeFile(
        this.dataPath + '/doctorsIndex.json',
        JSON.stringify({ id: this.doctorsLastId }),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { nome, especialidade } = createDoctorDto;
    const doctor = new Doctor(this.doctorsLastId + 1, nome, especialidade);
    this.doctors.push(doctor);

    try {
      this.save();
      this.saveLastId();
    } catch (error) {
      this.doctors.pop();
      throw new InternalServerErrorException();
    }

    this.doctorsLastId++;
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

  async delete(id: number) {
    const doctorIndex = this.doctors.findIndex(doctor => doctor.id === id);

    if (doctorIndex === -1) {
      throw new NotFoundException();
    }

    const deletedDoctor = this.doctors.splice(doctorIndex, 1)[0];

    return deletedDoctor;
  }
}
