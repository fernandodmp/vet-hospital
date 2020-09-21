import { IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  nome: string;

  @IsString()
  especialidade: string;
}
