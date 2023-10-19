import { ItemsJobStatusDto } from '../bigQuery/item-job-status.dto';
import { DatasetJobStatusDto } from '../bigQuery/dataset-job-status.dto';
import { TableJobStatusDto } from '../bigQuery/table-job-status.dto';

export interface SharedShape {
  names: string | string[];
  count: number;
  status: string;
}

export class PayloadDto {
  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    private datasetJobStatus: DatasetJobStatusDto,
    private tableJobStatus: TableJobStatusDto,
    private itemsJobStatus: ItemsJobStatusDto,
  ) {}
}
