import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseException } from './shared/base-exception';
@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.json({ code: exception.code, message: exception.message });
    console.error(
      // tslint:disable-line
      'BaseException code:%s message:%s \n%s',
      exception.code,
      exception.message,
      exception.detail,
    );
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BaseExceptionFilter());
  await app.listen(5005);
}
bootstrap();
