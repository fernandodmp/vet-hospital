export enum AppointmentStatus {
  ATENDIDO = 'ATENDIDO',
  PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO',
}

export class Appointment {
  constructor(
    public id: number,
    public nome: string,
    public especie: string,
    public raca: string,
    public atendimento: string,
    public urgencia: boolean,
    public status: AppointmentStatus,
  ) {}
}
