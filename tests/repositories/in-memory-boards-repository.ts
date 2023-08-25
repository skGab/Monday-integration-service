// import { Board } from 'src/domain/entities/board';
// import { BoardsRepository } from 'src/domain/repositories/boards.repository';

// export class InMemoryBoardsRepository implements BoardsRepository {
//   public items: Board[] = [];

//   getAll(): Promise<Board[] | null> {
//     const response = this.items;

//     if (!response || response.length === 0) {
//       return Promise.resolve(null);
//     }

//     return Promise.resolve(response);
//   }
// }
