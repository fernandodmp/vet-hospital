import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from './doctors.repository';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private doctorsRepository: DoctorsRepository) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.doctorsRepository.create(createDoctorDto);
  }

  findAll() {
    return this.doctorsRepository.findAll();
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsRepository.update(id, updateDoctorDto);
  }
}
