import type { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

/**
 * CSP Nonce Middleware
 * Generates a nonce for each request and adds it to response headers
 * This allows inline scripts/styles while maintaining CSP security
 * 
 * Returns an Express middleware function (not a NestJS middleware class)
 */
export function createCspNonceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Generate a random nonce for this request
    const nonce = crypto.randomBytes(16).toString('base64');
    
    // Store nonce in res.locals for use in templates/responses
    res.locals.nonce = nonce;
    
    // Add nonce to response header for client to use
    res.setHeader('X-CSP-Nonce', nonce);
    
    next();
  };
}
