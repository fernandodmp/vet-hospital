import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Patch('/:id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Get('/doctor/:id')
  async findDoctorNextAppointment(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const appointment = this.appointmentsService.findDoctorNextAppointment(id);
    return appointment
      ? res.status(200).json(appointment)
      : res.status(204).json();
  }
}
