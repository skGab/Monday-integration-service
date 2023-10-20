import { SharedShape } from '../core/payload.dto';

export abstract class InsertResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: { [key: string]: string }[];
  error?: any;
}

export interface ItemsOperation {
  table: string;
  items: string[];
  count: number;
  status: string;
}

export class ItemsJobStatusDto {
  constructor(public operationStatus: ItemsOperation[] | string) {}
}
