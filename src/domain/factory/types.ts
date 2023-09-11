type Column_values = {
  title: string;
  text: string;
};

type Items = {
  name: string;
  groups: { title: string };
  column_values: Column_values[];
};

export type Workspaces = {
  id: number;
  name: string;
};

export type BoardResponse = {
  id: string;
  name: string;
  items: Items[];
  workspace: { id: number; name: string };
};

export type MondayApiResponse = {
  data: {
    boards: BoardResponse[];
    workspaces: Workspaces[];
  };
};
