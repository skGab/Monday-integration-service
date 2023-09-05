import { Injectable } from '@nestjs/common';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { Board } from 'src/domain/entities/board';
import { IBoardsRepository } from '../../domain/database/iboards-repository';

@Injectable()
export class GetBoardsService {
  constructor(private boardsRepository: IBoardsRepository) {}

  async execute(): Promise<GetBoardsDto[]> {
    const response = await this.boardsRepository.getAll();

    const boards = response.map((board) => this.toDto(board));

    return boards;
  }

  private toDto(board: Board): GetBoardsDto {
    return {
      folderId: JSON.parse(board.id),
      name: board.props.name,
      columns: board.props.columns.map((column) => ({
        id: column.id,
        title: column.props.title,
        type: column.props.type,
        boardId: column.props.boardId,
      })),
      groups: board.props.groups.map((group) => ({
        id: group.id,
        title: group.props.title,
        boardId: group.props.boardId,
      })),
      items: board.props.items,
    };
  }
}
