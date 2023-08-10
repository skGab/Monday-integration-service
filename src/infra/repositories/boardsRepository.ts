import { Board } from "src/domain (abstracao)/entities/board";

interface BoardsRepository {
    findAll(): Promise<Board | null>
}