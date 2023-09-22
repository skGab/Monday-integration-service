import { ItemVo } from './item.vo';
import { WorkspaceVo } from './workspace-vo';

export class Board {
  constructor(
    public id: string,
    public name: string,
    public items: ItemVo[],
    public workspace: WorkspaceVo,
  ) {}
}
