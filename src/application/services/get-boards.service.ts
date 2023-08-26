import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/repositories/boards-repository';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { Board } from 'src/domain/entities/board';

@Injectable()
export class GetBoardsService {
  constructor(private boardsRepository: BoardsRepository) {}

  async execute(): Promise<GetBoardsDto[]> {
    const boards = await this.boardsRepository.getAll();
    return boards.map((board) => this.toDto(board));
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
