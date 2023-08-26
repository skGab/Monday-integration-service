// import { Injectable } from '@nestjs/common';
// import { TransferBoardService } from '../services/transfer-boards.service';
// import { Board } from 'src/domain/entities/board';
// import { TransferBoardsDto } from '../dto/transfer-boards.dto';

// @Injectable()
// export class TransferBoards {
//   constructor(private transferBoardsService: TransferBoardService) {}

//   async run(): Promise<TransferBoardsDto[]> {
//     const boards = await this.transferBoardsService.execute();
//     return boards.map((board) => this.toDto(board));
//   }

//   private toDto(board: Board): TransferBoardsDto {
//     return {
//       folderId: board.id,
//       name: board.props.name,
//       groups: board.props.groups,
//       columns: board.props.columns,
//       items: board.props.items,
//     };
//   }
// }
