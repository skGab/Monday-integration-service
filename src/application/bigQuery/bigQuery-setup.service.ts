import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { BoardVo } from 'src/domain/board/board-vo';
import { SanitizeColumn } from '../board/utils/sanitize-column';

@Injectable()
export class BigQuerySetupService {
  private sanitizeColumn: SanitizeColumn;

  constructor(private bigQueryRepository: BigQueryRepository) {
    this.sanitizeColumn = new SanitizeColumn();
  }
}
