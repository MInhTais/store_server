import { ApiResponse } from '../@types/apiResponse.type';
import ApiStatus from '../constants/apiStatuses.enum';

export function getApiResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    status: ApiStatus.SUCCESS,
    message: message,
    data: data,
  };
}
