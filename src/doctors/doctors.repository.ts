import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { Doctor } from './doctor.entity';
import * as fs from 'fs';
import * as util from 'util';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DoctorsRepository {
  file: string;

  doctors: Doctor[];

  constructor() {
    this.file = `${__dirname}/../../data/doctors.json`;
    this.doctors = JSON.parse(fs.readFileSync(this.file).toString());
  }

  async save(doctors: Doctor[]) {
    const writeFile = util.promisify(fs.writeFile);
    try {
      await writeFile(this.file, JSON.stringify(doctors));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { nome, especialidade } = createDoctorDto;
    const doctor = new Doctor(this.doctors.length + 1, nome, especialidade);
    this.doctors.push(doctor);

    try {
      this.save(this.doctors);
    } catch (error) {
      this.doctors.pop();
      throw new InternalServerErrorException();
    }

    return doctor;
  }
}
