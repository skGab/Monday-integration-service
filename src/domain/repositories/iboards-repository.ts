import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';

@Injectable()
export abstract class IBoardsRepository {
  // abstract transferAll(): Promise<Board[] | null>;
  abstract getAll(): Promise<Board[] | null>;
}
