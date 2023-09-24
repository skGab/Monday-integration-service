import { Board } from '../board/entities/board';

interface Status {
  step: string;
  success: boolean;
  error?: string;
}

export class Payload {
  private datasets = [];
  private tables = [];
  private boards: Board[] = [];
  private status: Status[] = [];

  // Methods to update Tables, Datasets, and Boards
  addTable(table: any): void {
    this.tables.push(table);
  }

  addDataset(dataset: any): void {
    this.datasets.push(dataset);
  }

  addBoard(boards: Board[]): void {
    boards.map((board) => this.boards.push(board));
  }

  // Method to update Status
  updateStatus(newStatus: Status): void {
    this.status.push(newStatus);
  }

  // Getter methods to access Tables, Datasets, Boards, and Status
  getTables(): any[] {
    return this.tables;
  }

  getDatasets(): any[] {
    return this.datasets;
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getStatus(): Status[] {
    return this.status;
  }
}
