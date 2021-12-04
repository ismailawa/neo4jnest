// common/Base.exception.ts
/**
 * Base exceptions
 */
export class BaseException {
  constructor(
    readonly code: number,
    readonly message: string,
    readonly detail?: string,
  ) {}
}
/**
 * parametric anomaly
 */
export class ParamException extends BaseException {
  constructor(message = 'parameter error', detail?: string) {
    super(400, message, detail);
  }
}

/**
 * dto anomaly
 */
export class DtoException extends BaseException {
  constructor(message = 'parameter error', detail?: string) {
    super(400, message, detail);
  }
}
export class ServerException extends BaseException {
  constructor(message = 'parameter error', detail?: string) {
    super(500, message, detail);
  }
}
export class NotFoundException extends BaseException {
  constructor(message = 'parameter error', detail?: string) {
    super(404, message, detail);
  }
}
/**
 * Permission exception
 */
export class AuthException extends BaseException {
  constructor(message = 'no access', detail?: string) {
    super(403, message, detail);
  }
}
