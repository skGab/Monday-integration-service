import {
  Controller,
  Logger,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Controller('workspaces')
export class WorkSpaceController {
  logger = new Logger(WorkSpaceController.name);

  constructor() {}

  @Get()
  async CheckingForWorkspaces() {
    try {
      // const workspaces = await this.handleBigQueryWorkspacesService.run();
      // return workspaces;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error durante a validação de Areas de Trabalho',
        },

        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
