import { Injectable } from '@nestjs/common';
import { ItemVo } from 'src/domain/board/item.vo';
import { SanitizeColumnService } from './sanitize-column.service';

@Injectable()
export class PrepareItemsService {
  constructor(private sanitizeColumnService: SanitizeColumnService) {}

  run(items: ItemVo[]) {
    return items.map((item) => {
      if (!item.group || item.group.title === undefined) {
        console.error('Error with item: ', item);
      }

      const transformed = {
        solicitacao: item.name,
        grupo: item.group.title,
      };

      item.column_values.forEach((column) => {
        transformed[this.sanitizeColumnService.run(column.title)] = column.text;
      });

      const result = Array.isArray(transformed[0])
        ? transformed[0]
        : transformed;
      // NEED TO RETURN THE RIGHT JSON STRUCTURE
      // AFTER INSERTING DATA ON THE TABLE, CHECK FOR THE CRUD METHOD

      return result;
    });
  }
}
