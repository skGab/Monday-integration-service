import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/database/bigQuery-repository';
import { MondayRepository } from 'src/domain/database/monday-repository';

@Injectable()
export class TransferBoardService {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepository: BigQueryRepository,
  ) {}

  async createBigQueryWorkSpaces() {
    const mondayWorkSpaces = await this.mondayRepositoryService.getWorkSpaces();

    // VALIDATION
    const validWorkspaces = mondayWorkSpaces.filter((workspace) => {
      const pattern = /^[a-zA-Z0-9_]+$/;
      return pattern.test(workspace.name.trim());
    });

    const bigQueryWorkspaces = await this.bigQueryRepository.createWorkspaces(
      validWorkspaces,
    );

    return bigQueryWorkspaces;
  }

  async run() {
    const mondayBoards = await this.mondayRepositoryService.getBoards();
    // const response = await this.bigQueryRepository.transferAllBoards(
    //   mondayBoards,
    // );

    return mondayBoards;
  }
}
