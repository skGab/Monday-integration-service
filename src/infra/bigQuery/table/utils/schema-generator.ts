import { BoardEntity } from 'src/domain/entities/board/board-entity';

export class SchemaGenerator {
  private schema;

  run(board: BoardEntity) {
    const uniqueColumnTitles = new Set();

    // LOOPING THROUGHT EACH COLUMN FROM BOARDS.ITEMS
    const schemaFromItems = board.items_page.items.flatMap((item) => {
      return item.column_values
        .map((values) => {
          // CHEKING FOR REPEATED COLUMNS ON THE SCHEMA
          if (uniqueColumnTitles.has(values.column.title)) return null;

          uniqueColumnTitles.add(values.column.title);

          return {
            name: values.column.title,
            type: 'STRING',
            mode: 'NULLABLE',
          };
        })
        .filter(Boolean);
    });

    this.schema = [
      {
        name: 'nome',
        type: 'STRING',
        mode: 'NULLABLE',
      },
      { name: 'grupo', type: 'STRING', mode: 'NULLABLE' },
      ...schemaFromItems,
    ];

    return this.schema;
  }
}
