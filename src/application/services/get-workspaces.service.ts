import { Injectable } from '@nestjs/common';
import { BoardsRepository } from '../../domain/database/boards-repository';
import { Workspaces } from 'src/domain/factory/types';

@Injectable()
export class GetWorkSpacesService {
  constructor(private boardsRepositoryService: BoardsRepository) {}

  async run(): Promise<Workspaces[]> {
    const workspaces = await this.boardsRepositoryService.getAllWorkSpaces();

    console.log();

    return workspaces.filter((workspace) =>
      this.validateWorkspaceName(workspace),
    );
  }

  private validateWorkspaceName(workspace: Workspaces): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.name);
  }
}
