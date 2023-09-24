import { Column_valueVo } from '../column-vo';

export class Item {
  constructor(
    public name: string,
    public state: string,
    public group: { title: string },
    public column_values: Column_valueVo[],
  ) {}
}
