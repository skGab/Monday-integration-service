// import { Injectable } from '@nestjs/common';
// import { BoardsRepository } from 'src/application/repositories/boards.repository';
// import { TransferBoardsDto } from '../dto/Transfer-boards.dto';

// @Injectable()
// export class TransferBoardService {
//   constructor(private boardsRepository: BoardsRepository) {}

//   async execute(): Promise<TransferBoardsDto[]> {
//     const boards = await this.boardsRepository.transferAll();
//     return boards;
//   }
// }

// // const response = boards.map((board) => ({
// //   folder_id: board.id,
// //   name: board.props.name,
// //   columns: board.props.columns,
// //   groups: board.props.groups,
// //   items: board.props.items,
// // }));
// //
