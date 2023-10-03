export class DatasetVo {
  constructor(public names: string[]) {}

  addWorkspace(datasetsNames: string[]): void {
    this.names = [...this.names, ...datasetsNames];
  }
}
