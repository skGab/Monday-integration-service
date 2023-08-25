import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/repositories/boards.repository';
import { GetBoardsDto } from '../dto/get-boards.dto';

@Injectable()
export class TransferBoardService {
  constructor(private boardsRepository: BoardsRepository) {}

  async execute(): Promise<GetBoardsDto[]> {
    const boards = await this.boardsRepository.getAll();

    const response = boards.map((board) => ({
      folder_id: board.id,
      name: board.props.name,
      columns: board.props.columns,
      groups: board.props.groups,
      items: board.props.items,
    }));

    return response;
  }
}
