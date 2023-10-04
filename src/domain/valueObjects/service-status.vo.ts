import { Payload } from '../entities/payload';

interface Body {
  step: string;
  success: boolean;
  error?: string;
}

export class ServiceStatusVo {
  static status: Body;

  private constructor(private status: Body) {}

  static createStatus(newStatus: Body) {
    const status = new ServiceStatusVo(newStatus);
  }
}
