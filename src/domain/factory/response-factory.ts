interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface FailureResponse {
  success: false;
  error: any;
}

export type ServiceResponse<T> = SuccessResponse<T> | FailureResponse;

export class ResponseFactory {
  static createSuccess<T>(data: T): ServiceResponse<T> {
    return {
      success: true,
      data,
    };
  }

  static createFailure(error: any): ServiceResponse<null> {
    return {
      success: false,
      error,
    };
  }
}
