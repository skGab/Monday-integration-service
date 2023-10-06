abstract class Column_valueVo {
  column: { title: string };
  text: string;
}

abstract class Items {
  state: string;
  name: string;
  group: {
    title: string;
  };
  column_values: Column_valueVo[];
}

export class ItemsPage {
  constructor(public items: Items[]) {}

  sanitize(): ItemsPage {
    const sanitizedItems = this.items.map((item) => {
      const sanitizedColumnValues = item.column_values.map((column_value) => {
        return {
          ...column_value,
          column: {
            title: this.sanitizeTitle(column_value.column.title),
          },
        };
      });

      return { ...item, column_values: sanitizedColumnValues };
    });

    return new ItemsPage(sanitizedItems);
  }

  // REMOVING SPECIAL CHARACTERS AND SPACES FROM COLUMNS TITLES
  sanitizeTitle(title: string) {
    const specialCharsMap = {
      ç: 'c',
      ã: 'a',
      á: 'a',
      ê: 'e',
    };

    return title
      .toLowerCase() // Convert to lowercase for uniformity
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[çãáê]/g, (char) => specialCharsMap[char]) // Translate special characters
      .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric characters except underscores
      .replace(/\u00E1/g, 'a');
  }
}
