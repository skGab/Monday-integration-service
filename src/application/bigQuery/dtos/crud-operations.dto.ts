export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: { [key: string]: string }[];
}

export interface Status {
  count: number;
  status: string;
}

export class CrudOperationsDto {
  constructor(
    public newItems?: Status,
    public updatedItems?: Status,
    public excludedItems?: Status,
    public generalError?: string,
  ) {}
}
