import { ItemVo } from './item.vo';
import { WorkspaceVo } from './workspace-vo';

export abstract class BoardVo {
  id: string;
  name: string;
  items: ItemVo[];
  workspace: WorkspaceVo;
}
