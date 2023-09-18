import { Column_valueVo } from './column-vo';

export abstract class ItemVo {
  name: string;
  group: { title: string };
  column_values: Column_valueVo[];
}
