import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointment.repository';
import { CreateAppointmentDto } from './dtos/create-appointment';

@Injectable()
export class AppointmentsService {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsRepository.create(createAppointmentDto);
  }

  findAll() {
    return this.appointmentsRepository.findAll();
  }
}
