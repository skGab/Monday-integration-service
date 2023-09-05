import { ItemVo } from '../valueObject/item-vo';

type BoardShap = {
  id: string;
  name: string;
  items: ItemVo[];
  workspace: { id: number; name: string };
};
export class Board {
  constructor(public props: BoardShap) {}
}
