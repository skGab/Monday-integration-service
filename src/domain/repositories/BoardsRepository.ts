import { BoardProps } from '../entities/board';

export interface BoardsRepository {
  findAll(clienteId: number): Promise<BoardProps | null>;
}
