import { IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  especialidade?: string;
}
