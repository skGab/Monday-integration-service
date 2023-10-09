export abstract class Column_valueVo {
  column: { title: string };
  text: string;
}

export abstract class Items {
  state: string;
  name: string;
  group: {
    title: string;
  };
  column_values: Column_valueVo[];
}

export class ItemsPage {
  constructor(public items: Items[]) {}
}
