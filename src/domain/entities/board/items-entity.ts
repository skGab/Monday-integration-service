export abstract class Column_valueVo {
  column: { title: string };
  text: string;
}

export abstract class ItemsEntity {
  name: string;
  state: string;
  group: {
    title: string;
  };
  column_values: Column_valueVo[];
}

export class ItemsPage {
  constructor(public items: ItemsEntity[]) {}
}
