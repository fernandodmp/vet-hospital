import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointment.repository';
import { CreateAppointmentDto } from './dtos/create-appointment';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsRepository.create(createAppointmentDto);
  }

  findAll() {
    return this.appointmentsRepository.findAll();
  }

  findDoctorNextAppointment(id: number) {
    const doctor = this.doctorsService.findDoctor(id);
    const openAppointments = this.appointmentsRepository
      .findOpen()
      .filter(appointment => appointment.atendimento === doctor.especialidade);

    const urgents = openAppointments.filter(
      appointment => appointment.urgencia,
    );

    if (urgents.length > 0) {
      return urgents[0];
    }

    return openAppointments[0];
  }
}
