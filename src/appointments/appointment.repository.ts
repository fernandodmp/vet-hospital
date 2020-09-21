import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Appointment, AppointmentStatus } from './appointment.entity';
import * as fs from 'fs';
import { CreateAppointmentDto } from './dtos/create-appointment';
import { save } from '../utils/IOUtils';

@Injectable()
export class AppointmentsRepository {
  private dataPath: string;

  private appointmentsLastId: number;
  private appointments: Appointment[];

  constructor() {
    this.dataPath = `${__dirname}/../../data`;
    this.appointments = JSON.parse(
      fs.readFileSync(this.dataPath + '/appointments.json').toString(),
    );
    this.appointmentsLastId = JSON.parse(
      fs.readFileSync(this.dataPath + '/appointmentsId.json').toString(),
    ).id;
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { nome, especie, raca, atendimento, urgencia } = createAppointmentDto;
    const doctor = new Appointment(
      this.appointmentsLastId + 1,
      nome,
      especie,
      raca,
      atendimento,
      urgencia,
      AppointmentStatus.PENDENTE,
    );
    this.appointments.push(doctor);

    try {
      await save(this.dataPath + '/appointments.json', this.appointments);
      await save(this.dataPath + '/appointmentsId.json', {
        id: this.appointmentsLastId + 1,
      });
    } catch (error) {
      this.appointments.pop();
      throw new InternalServerErrorException();
    }

    this.appointmentsLastId++;
    return doctor;
  }

  findAll() {
    return this.appointments;
  }

  findOpen() {
    return this.appointments.filter(
      appointment => appointment.status === AppointmentStatus.PENDENTE,
    );
  }
}
