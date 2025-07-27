import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status: number;
}

export class ApiResponseHandler {
  static success<T>(data: T, status: number = 200): NextResponse {
    return NextResponse.json(data, { status });
  }

  static error(message: string, status: number = 500): NextResponse {
    return NextResponse.json({ message }, { status });
  }

  static validationError(message: string = 'Missing required fields'): NextResponse {
    return this.error(message, 400);
  }

  static unauthorizedError(message: string = 'Unauthorized'): NextResponse {
    return this.error(message, 401);
  }

  static internalError(message: string = 'Internal server error'): NextResponse {
    return this.error(message, 500);
  }

  static async handleServiceResponse(response: Response): Promise<NextResponse> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return this.error(
          data.error || `Service request failed`,
          response.status
        );
      }

      return this.success(data, response.status);
    } catch (error) {
      console.error('Service response handling error:', error);
      return this.internalError('Failed to process service response');
    }
  }
}

export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
