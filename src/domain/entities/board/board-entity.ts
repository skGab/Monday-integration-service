import { ItemsPage } from './items-entity';
import { WorkspaceEntity } from './workspace-entity';

export class BoardEntity {
  constructor(
    public id: string,
    public state: string,
    public name: string,
    public items_page: ItemsPage,
    public activity_logs: {
      event: string;
      data: string;
    }[],
    public workspace: WorkspaceEntity,
  ) {}

  getId() {
    return this.id;
  }
}
