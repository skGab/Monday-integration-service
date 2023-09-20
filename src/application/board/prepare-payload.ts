import { BoardVo } from 'src/domain/board/board-vo';

export class PreparePayload {
  run(bigQueryItems: string[], board: BoardVo) {
    // Step 1: Prepare individual payloads for each item.
    const preparedPayloads = board.items.map(this.prepareSinglePayload);

    // Step 2: Filter out duplicates.
    const { corePayload, duplicateItems } = this.checkDuplicatedItems(
      bigQueryItems,
      preparedPayloads,
    );

    return { corePayload, duplicateItems };
  }

  private checkDuplicatedItems(
    bigQueryItems: string[],
    preparedPayloads: Array<{ [key: string]: string }>,
  ) {
    const duplicateItems: Array<{ [key: string]: string }> = [];
    const corePayload: Array<{ [key: string]: string }> = [];

    preparedPayloads.forEach((payload) => {
      if (bigQueryItems.includes(payload.id_de_elemento)) {
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

  private prepareSinglePayload(item: any): { [key: string]: string } {
    const payload: { [key: string]: string } = {};
    payload.solicitacao = item.name;
    payload.grupo = item.group.title;

    item.column_values.forEach((column: any) => {
      payload[column.title] = column.text;
    });

    return payload;
  }
}
