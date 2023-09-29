interface props {
  step: string;
  success: boolean;
  error?: string;
}

export class Status {
  constructor(
    public step: string,
    public success: boolean,
    public error?: string,
  ) {}

  updateStatus(newStatus: props): void {
    if (!newStatus) {
      this.error = 'Nenhum status encontrado';
      return;
    }

    this.step = newStatus.step;
    this.success = newStatus.success;

    if (newStatus.error) {
      this.error = newStatus.error;
    }
  }
}
