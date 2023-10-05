export interface ServiceResponse<T> {
  data: T | null;
  error?: any;
}

export class ResponseFactory {
  static async run<T>(promise: Promise<T>): Promise<ServiceResponse<T>> {
    return Promise.allSettled([promise]).then((results) => {
      const [{ value, reason }] = results as any;
      return { data: value, error: reason };
    });
  }
}
