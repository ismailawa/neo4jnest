import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  code: number;
  message: string;
}

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any) => ({
        code: 200,
        meta: data?.meta,
        links: data?.links,
        data: data.data,
        message: 'success',
      })),
    );
  }
}
