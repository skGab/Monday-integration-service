import { BoardVo } from 'src/domain/board/board-vo';

export class PreparePayload {
  run(bigQueryItems: string[], board: BoardVo): any {
    return board.items.map((item) => {
      const payload: { [key: string]: string } = {};

      payload.solicitacao = item.name;
      payload.grupo = item.group.title;

      item.column_values.forEach((column) => {
        payload[column.title] = column.text;
      });

      const { duplicateItems, corePayload } = this.checkDuplicatedItems(
        bigQueryItems,
        payload,
      );

      return { duplicateItems, corePayload };
    });
  }

  private checkDuplicatedItems(
    bigQueryItems: string[],
    payload: { [key: string]: string },
  ): { duplicateItems: any[]; corePayload: any } {
    const isDuplicate = bigQueryItems.some(
      (item) => item === payload.id_de_elemento,
    );

    if (isDuplicate) {
      return {
        duplicateItems: [payload],
        corePayload: null,
      };
    }

    return {
      duplicateItems: [],
      corePayload: payload,
    };
  }
}
