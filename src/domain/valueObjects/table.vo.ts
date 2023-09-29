export class TableVo {
  constructor(public names: string[] = []) {}

  addTable(tableName: string): void {
    this.names.push(tableName);
  }
}
