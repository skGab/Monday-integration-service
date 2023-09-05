import { Board } from 'src/domain/entities/board';
import { Injectable } from '@nestjs/common';

export abstract class Factory {
  abstract createBoard(boardData: any): Board;
}

@Injectable()
export class BoardFactory implements Factory {
  createBoard(boardData: any): Board {
    // DE ONDE DEVO IMPORTAR O SHAPE DA RESPOSTA DA API
    return new Board();
  }
}
