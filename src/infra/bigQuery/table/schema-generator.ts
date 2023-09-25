import { Board } from 'src/domain/entities/board/board';

export class SchemaGenerator {
  private schema;

  run(board: Board) {
    const uniqueColumnTitles = new Set();

    const schemaFromItems = board.items.flatMap((item) => {
      return item.column_values
        .map((column) => {
          if (uniqueColumnTitles.has(column.title)) return null;

          uniqueColumnTitles.add(column.title);

          return {
            name: column.title,
            type: 'STRING',
            mode: 'NULLABLE',
          };
        })
        .filter(Boolean);
    });

    this.schema = [
      { name: 'solicitacao', type: 'STRING', mode: 'NULLABLE' },
      { name: 'grupo', type: 'STRING', mode: 'NULLABLE' },
      ...schemaFromItems,
    ];

    return this.schema;
  }
}
