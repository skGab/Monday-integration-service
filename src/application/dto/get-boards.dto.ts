import { ColumnDto } from './column.dto';
import { GroupDto } from './group.dto';

export class GetBoardsDto {
  folder_id: number;
  name: string;
  columns: ColumnDto[];
  groups: GroupDto[];
  items: any[];
}
