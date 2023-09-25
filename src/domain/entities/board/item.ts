abstract class Column_valueVo {
  title: string;
  text: string;
}

export class Item {
  constructor(
    public name: string,
    public state: string,
    public group: { title: string },
    public column_values: Column_valueVo[],
  ) {}
}
