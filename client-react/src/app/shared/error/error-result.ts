import { ErrorType } from './error-type';

export interface ErrorResult {
  status: number;
  message: string;
  type: ErrorType;
}
