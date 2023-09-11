import { Injectable } from '@nestjs/common';
import { BoardsRepository } from '../../domain/database/boards-repository';
import { Workspaces } from 'src/domain/factory/types';

@Injectable()
export class GetWorkSpacesService {
  constructor(private boardsRepositoryService: BoardsRepository) {}

  async run(): Promise<Workspaces[]> {
    const workspaces = await this.boardsRepositoryService.getAllWorkSpaces();
    return workspaces;
  }
}
