import { BoardsRepository } from 'src/domain/repositories/BoardsRepository';

export class InMemoryChallengeRepository {
  constructor(private boardsRepository: BoardsRepository) {}
  
  
}
