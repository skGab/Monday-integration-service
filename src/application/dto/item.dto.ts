export class ItemDto {
    constructor(
      public solicitacoes: string,
      public grupo: string,
      public responsavel: string,
      public status: string,
      public area: string,
      public prioridade: string,
      public prazo: string,
      public duracao_dias: string,
      public controle_de_tempo: string,
      public demanda: string,
      public depende_de: string,
      public cliente: string,
      public subitems: string,
      public tags: string,
      public id_de_elemento: string,
    ) {}
  }
  