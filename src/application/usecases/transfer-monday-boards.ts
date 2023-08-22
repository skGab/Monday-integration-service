import { BoardsRepository } from "src/domain/repositories/BoardsRepository";

export class TransferMondayBoards {
  constructor(private boardsRepository: BoardsRepository) { }

  async execute() {
    const response = await this.boardsRepository.getAll()

    if (!response) {
      throw new Error('Nenhum repositorio encontrado')
    }

    return response;
  }
}
