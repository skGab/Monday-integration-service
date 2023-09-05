import { Column_valuesVo } from './column-values-vo';

export abstract class ItemVo {
  name: string;
  groups: { title: string };
  column_values: Column_valuesVo[];
}
