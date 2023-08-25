import { ColumnDto } from './column.dto';
import { GroupDto } from './group.dto';

export abstract class GetBoardsDto {
  folder_id: string;
  name: string;
  columns: ColumnDto[];
  groups: GroupDto[];
  items: any[];
}
