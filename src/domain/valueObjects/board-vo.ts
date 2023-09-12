abstract class ItemVo {
  name: string;
  groups: { title: string };
  column_values: Column_valueVo[];
}

abstract class Column_valueVo {
  title: string;
  text: string;
}

export abstract class WorkspaceVo {
  id: number;
  name: string;
}

export abstract class BoardVo {
  id: string;
  name: string;
  items: ItemVo[];
  workspace: WorkspaceVo;
}
