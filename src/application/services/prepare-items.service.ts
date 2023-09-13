import { ItemVo } from 'src/domain/valueObjects/board-vo';
import { SanitizeColumnService } from './sanitize-column.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrepareItemsService {
  constructor(private sanitizeColumnService: SanitizeColumnService) {}

  run(items: ItemVo[]) {
    return items.map((item) => {
      if (!item.group || item.group.title === undefined) {
        console.error('Error with item: ', item);
      }

      const transformed = {
        solicitacoes: item.name,
        grupo: item.group.title,
      };

      item.column_values.forEach((column) => {
        transformed[this.sanitizeColumnService.run(column.title)] = column.text;
      });

      return transformed;
    });
  }
}
