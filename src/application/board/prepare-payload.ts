import { BoardVo } from 'src/domain/board/board-vo';

export class PreparePayload {
  run(board: BoardVo): any {
    return board.items.map((item) => {
      const payload: { [key: string]: string } = {};

      payload.solicitacao = item.name;
      payload.grupo = item.group.title;

      item.column_values.forEach((column) => {
        payload[column.title] = column.text;
      });

      return payload;
    });
  }
}
