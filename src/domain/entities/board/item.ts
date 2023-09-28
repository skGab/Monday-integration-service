abstract class Column_valueVo {
  title: string;
  text: string;
}

export class Item {
  constructor(
    public name: string,
    public state: string,
    public group: { title: string },
    public column_values: Column_valueVo[],
  ) {}

  sanitize(): Item {
    const sanitizedColumns = this.column_values.map((column) => {
      const sanitizedTitle = this.sanitizeTitle(column.title);
      return { ...column, title: sanitizedTitle };
    });

    return new Item(this.name, this.state, this.group, sanitizedColumns);
  }

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
