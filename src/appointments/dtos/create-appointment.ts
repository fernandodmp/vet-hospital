import { IsBoolean, IsString } from 'class-validator';
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
