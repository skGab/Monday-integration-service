export class DatasetVo {
  constructor(public names: string[]) {}

  addDataset(datasetsNames: string[]): void {
    this.names = [...this.names, ...datasetsNames];
  }
}
