type ServiceResponse<T> = SuccessResponse<T> | FailureResponse;

interface SuccessResponse<T> {
  status: true;
  message: string;
  data: T;
}

interface FailureResponse {
  status: false;
  message: string;
  error: any;
}

export class ResponseFactory {
  static createSuccess<T>(message: string, data: T): ServiceResponse<T> {
    return {
      status: true,
      message,
      data,
    };
  }

  static createFailure(message: string, error: any): ServiceResponse<null> {
    return {
      status: false,
      message,
      error,
    };
  }
}
