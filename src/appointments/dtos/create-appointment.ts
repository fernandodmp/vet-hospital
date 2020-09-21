import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';
export class CreateAppointmentDto {
  @IsString()
  nome: string;

  @IsString()
  especie: string;

  @IsString()
  raca: string;

  @IsString()
  atendimento: string;

  @IsBoolean()
  urgencia: boolean;
}
