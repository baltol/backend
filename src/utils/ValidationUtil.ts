import * as ajv from 'ajv';
import { NextFunction, Request, Response } from 'express';

type ReqSectionType = 'query' | 'body' | 'params'

export class ValidationUtil {

  public static decorator = {
    validateRequest: (schema: { $schema: string }, reqSection: ReqSectionType) => {
      return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const fn = descriptor.value;
        descriptor.value = (req: Request, res: Response, next: NextFunction) => {
          return ValidationUtil.isRequestValid(req, res, schema, reqSection) ? fn(req, res, next) : next()
        }
      }
    }
  }

  public static validateRequest(req: Request, res: Response, next: NextFunction, schema: { $schema: string },
    reqSection: ReqSectionType) {
    if (ValidationUtil.isRequestValid(req, res, schema, reqSection)) {
      next()
    }
  }

  private static isRequestValid(req: Request, res: Response, schema: any, reqSection: ReqSectionType) {
    const ajvValidator = ajv({ coerceTypes: true }).compile(schema);
    if (ajvValidator(req[reqSection])) {
      return true
    }

    res.status(400).json(process.env.NODE_ENV === 'local' ? ajvValidator.errors : { error: 'Invalid request' })
    return false
  }
}