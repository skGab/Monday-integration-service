import { Board } from 'src/domain/board/entities/board';
import { Item } from 'src/domain/board/entities/item';

export class PreparePayload {
  run(bigQueryItemsId: string[], board: Board) {
    // Prepare individual payloads for each item.
    const preparedPayloads = board.items.map(this.prepareSinglePayload);

    // Filter out duplicates.
    const { corePayload, duplicateItems } = this.checkDuplicatedItems(
      bigQueryItemsId,
      preparedPayloads,
    );

    return { corePayload, duplicateItems };
  }

  private checkDuplicatedItems(
    bigQueryItemsId: string[],
    preparedPayloads: Array<{ [key: string]: string }>,
  ) {
    const duplicateItems: Array<{ [key: string]: string }> = [];
    const corePayload: Array<{ [key: string]: string }> = [];

    preparedPayloads.forEach((payload) => {
      if (bigQueryItemsId.includes(payload.id_de_elemento)) {
        duplicateItems.push(payload);
      } else {
        corePayload.push(payload);
      }
    });

    return {
      duplicateItems,
      corePayload,
    };
  }

  private prepareSinglePayload(item: Item): { [key: string]: string } {
    const payload: { [key: string]: string } = {};
    payload.solicitacao = item.name;
    payload.grupo = item.group.title;

    item.column_values.forEach((column: any) => {
      payload[column.title] = column.text;
    });

    return payload;
  }
}
