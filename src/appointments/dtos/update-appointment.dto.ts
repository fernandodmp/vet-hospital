import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';
export class UpdateAppointmentDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
