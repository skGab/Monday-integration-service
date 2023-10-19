import { BoardEntity } from 'src/domain/entities/board/board-entity';
import {
  Column_valueVo,
  ItemsEntity,
  ItemsPage,
} from 'src/domain/entities/board/items-entity';

export class PreparePayload {
  run(bigQueryItemsId: string[], board: BoardEntity) {
    // Filter out duplicates.
    // const { coreItems, duplicateItems } = this.checkDuplicatedItems(
    //   bigQueryItemsId,
    //   prepareItems,
    // );

    // return { coreItems, duplicateItems };
    return;
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
}
