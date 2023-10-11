import { BoardEntity } from 'src/domain/entities/board/board-entity';
import {
  Column_valueVo,
  ItemsEntity,
  ItemsPage,
} from 'src/domain/entities/board/items-entity';

export class PreparePayload {
  run(bigQueryItemsId: string[], board: BoardEntity) {
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

  private prepareSinglePayload(items: ItemsEntity): {
    [key: string]: string;
  } {
    const payload: { [key: string]: string } = {};

    payload.nome = items.name;
    payload.grupo = items.group.title;

    items.column_values.forEach((column: Column_valueVo) => {
      payload[column.column.title] = column.text;
    });

    return payload;
  }
}
