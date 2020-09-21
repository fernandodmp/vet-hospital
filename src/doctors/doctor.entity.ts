export class Doctor {
  id: number;
  nome: string;
  especialidade: string;

  constructor(id: number, nome: string, especialidade: string) {
    this.nome = nome;
    this.especialidade = especialidade;
    this.id = id;
  }
}
