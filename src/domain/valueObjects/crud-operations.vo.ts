import { BodyShape } from '../entities/payload';

export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: { [key: string]: string }[];
}

export class CrudOperationsVo {
  constructor(
    public newItems: BodyShape,
    public updatedItems: BodyShape,
    public excludedItems: BodyShape,
  ) {}

  // addTransfer(
  //   newItemsStatus?: TransferResponse,
  //   updatedItemsStatus?: TransferResponse | string[],
  // ): void {
  //   // NEW ITEMS
  //   if (!newItemsStatus) {
  //     this.newItems.message = 'Nenhum Item novo para ser inserido';
  //   } else {
  //     this.newItems = {
  //       count: newItemsStatus.insertedPayload.length,
  //       names: newItemsStatus.insertedPayload.map((item) => item.solicitacao),
  //     };
  //   }

  //   // UPDATED ITEMS
  //   if (!updatedItemsStatus) {
  //     this.updatedItems.message = 'Nenhum Item para ser atualizado';
  //   } else {
  //     if (Array.isArray(updatedItemsStatus)) {
  //       this.updatedItems = {
  //         count: updatedItemsStatus.length,
  //         names: updatedItemsStatus,
  //       };
  //     } else {
  //       // Handle this case if it's not an array but a TransferResponse
  //     }
  //   }
  // }
}
