import { Injectable } from '@nestjs/common';
import { TransferBoardsDto } from '../dto/transfer-boards.dto';
import { IBoardsRepository } from 'src/domain/repositories/iboards-repository';
import { Board } from 'src/domain/entities/board';

@Injectable()
export class TransferBoardService {
  constructor(private boardsRepository: IBoardsRepository) {}

  // async execute(): Promise<TransferBoardsDto[]> {
  //   const boards = await this.boardsRepository.transferAll();
  //   return boards.map((board) => this.toDto(board));
  // }

  private toDto(board: Board): TransferBoardsDto {
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
