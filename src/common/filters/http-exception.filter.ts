import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const errorResponse = {
      status: 'error',
      code: status,
      message: 'Validation failed',
      errors: {},
    };

    // Lấy thông tin lỗi từ exception
    const validationErrors = exception.getResponse();

    if (typeof validationErrors === 'object' && 'message' in validationErrors) {
      const messages = Array.isArray(validationErrors.message)
        ? validationErrors.message
        : [validationErrors.message];

      // Kiểm tra nếu các phần tử trong messages là chuỗi
      if (typeof messages[0] === 'string') {
        messages.forEach((msg) => {
          // Tách tên trường từ thông báo lỗi
          const [field] = msg.split(' ', 1);
          if (field) {
            errorResponse.errors[field] = msg;
          }
        });
      } else {
        // Nếu messages là các đối tượng với cấu trúc chi tiết hơn
        messages.forEach((error) => {
          if (typeof error === 'object' && error.property) {
            const property = error.property;
            const constraints = error.constraints;

            if (constraints) {
              errorResponse.errors[property] =
                Object.values(constraints).join(', ');
            }
          }
        });
      }
    }

    response.status(status).json(errorResponse);
  }
}
