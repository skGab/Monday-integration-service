import { ItemsPage } from './item';
import { Workspace } from './workspace';

export class Board {
  constructor(
    public id: string,
    public state: string,
    public name: string,
    public item_terminology: string,
    public items_page: ItemsPage,
    public workspace: Workspace,
  ) {}
}
