abstract class ColumnDto {
  id: string;
  title: string;
  type: string;
  boardId: number;
}

abstract class GroupDto {
  id: string;
  title: string;
  boardId: number;
}

export abstract class TransferBoardsDto {
  folderId: number;
  name: string;
  columns: ColumnDto[];
  groups: GroupDto[];
  items: any[];
}
