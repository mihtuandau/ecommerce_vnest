import type { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';


export function createCspNonceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {

    const nonce = crypto.randomBytes(16).toString('base64');

    res.locals.nonce = nonce;

    res.setHeader('X-CSP-Nonce', nonce);
    
    next();
  };
}






