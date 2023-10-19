import { Injectable } from '@nestjs/common';
import { MondayRepository } from 'src/domain/repositories/monday-repository';
import { BoardDto } from '../dtos/monday/monday.dto';
import { WorkspaceDto } from '../dtos/monday/workspace.dto';

@Injectable()
export class MondayHandleService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  // GET MONDAY BOARDS
  async getBoards(): Promise<BoardDto> {
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      // RETURNING NULL IF ANY BOARDS FOUND
      if (!mondayBoards) {
        return new BoardDto(
          null,
          [],
          0,
          'Nenhum Board Encontrado durante a busca',
        );
      }

      // RETURNING MONDAY VO
      return new BoardDto(
        mondayBoards,
        mondayBoards.map((board) => board.name),
        mondayBoards.length,
        'Success',
      );
    } catch (error) {
      // RETURNING MONDAY VO WITH ERROR
      return new BoardDto(null, [], 0, error.message);
    }
  }

  // GET MONDAY WORKSPACES
  async getWorkspaces(): Promise<WorkspaceDto> {
    try {
      const workspaces = await this.mondayRepositoryService.getWorkSpaces();

      // RETURNING NULL IF ANY WORKSPACES FOUND
      if (!workspaces) {
        return new WorkspaceDto(
          null,
          null,
          0,
          'Nenhuma area de trabalho Encontrada durante a busca',
        );
      }

      // RETURNING MONDAY VO
      return new WorkspaceDto(
        workspaces,
        workspaces.map((workspaces) => workspaces.name),
        workspaces.length,
        'Success',
      );
    } catch (error) {
      // RETURNING MONDAY VO WITH ERROR
      return new WorkspaceDto(null, [], 0, error.message);
    }
  }
}
