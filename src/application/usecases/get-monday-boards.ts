import { Board } from 'src/domain/entities/board';
export class GetMondayBoards {
    constructor(private Board: Board) { }

    handle() {
        return this.Board.findAll()
    }
}