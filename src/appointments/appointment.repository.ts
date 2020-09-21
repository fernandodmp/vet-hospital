import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Appointment, AppointmentStatus } from './appointment.entity';
import * as fs from 'fs';
import { CreateAppointmentDto } from './dtos/create-appointment';
import { save } from '../utils/IOUtils';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Injectable()
export class AppointmentsRepository {
  private dataPath: string;

  appointmentsLastId: number;
  appointments: Appointment[];

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

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointmentIndex = this.appointments.findIndex(
      appointment => appointment.id === id,
    );

    if (appointmentIndex === -1) {
      throw new NotFoundException();
    }

    const { status } = updateAppointmentDto;

    const oldAppointment = { ...this.appointments[appointmentIndex] };
    this.appointments[appointmentIndex].status = status;

    try {
      await save(this.dataPath + '/appointments.json', this.appointments);
    } catch (error) {
      this.appointments[appointmentIndex] = oldAppointment;
      throw new InternalServerErrorException();
    }

    return this.appointments[appointmentIndex];
  }

  findOne(id: number) {
    const appointment = this.appointments.find(
      appointment => appointment.id === id,
    );
    if (!appointment) throw new NotFoundException();
    return appointment;
  }
}
