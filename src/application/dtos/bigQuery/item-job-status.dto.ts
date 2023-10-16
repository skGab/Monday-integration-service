import { SharedShape } from '../core/payload.dto';

export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: { [key: string]: string }[];
}

export class ItemsJobStatus {
  constructor(
    public newItems?: SharedShape,
    public updatedItems?: SharedShape,
    public excludedItems?: SharedShape,
    public generalError?: string,
  ) {}
}
