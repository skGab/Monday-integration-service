import { Board } from 'src/domain/entities/board/board';
import { Items, ItemsPage } from 'src/domain/entities/board/item';

export class PreparePayload {
  run(bigQueryItemsId: string[], board: Board) {
    // Prepare individual payloads for each item.
    const prepareItems = board.items_page.items.map(this.prepareSinglePayload);

    // Filter out duplicates.
    const { coreItems, duplicateItems } = this.checkDuplicatedItems(
      bigQueryItemsId,
      prepareItems,
    );

    return { coreItems, duplicateItems };
  }

  private checkDuplicatedItems(
    bigQueryItemsId: string[],
    preparedPayloads: Array<{ [key: string]: string }>,
  ) {
    const duplicateItems: Array<{ [key: string]: string }> = [];
    const coreItems: Array<{ [key: string]: string }> = [];

    preparedPayloads.forEach((payload) => {
      if (bigQueryItemsId.includes(payload.id_de_elemento)) {
        duplicateItems.push(payload);
      } else {
        coreItems.push(payload);
      }
    });

    return {
      duplicateItems,
      coreItems,
    };
  }

  private prepareSinglePayload(items: Items): {
    [key: string]: string;
  } {
    const payload: { [key: string]: string } = {};

    payload.name = items.name;
    payload.grupo = items.group.title;

    items.column_values.forEach((column: any) => {
      payload[column.title] = column.text;
    });

    return payload;
  }
}
