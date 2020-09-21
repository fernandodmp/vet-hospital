import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from './doctors.repository';
import { CreateDoctorDto } from './dtos/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private doctorsRepository: DoctorsRepository) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.doctorsRepository.create(createDoctorDto);
  }
}
