abstract class ColumnDto {
  title: string;
  id: string;
  type: string;
  boardId: number;
}

abstract class GroupDto {
  title: string;
  id: string;
  boardId: number;
}

export abstract class GetBoardsDto {
  folderId: number;
  name: string;
  columns: ColumnDto[];
  groups: GroupDto[];
  items: any[];
}
