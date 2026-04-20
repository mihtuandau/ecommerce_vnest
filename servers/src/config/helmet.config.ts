import type { HelmetOptions } from 'helmet';
import * as crypto from 'crypto';


export function getHelmetConfig(nonce?: string): HelmetOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  const cspNonce = nonce || crypto.randomBytes(16).toString('base64');

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://dautuan.com')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  const cspDirectives = isProduction
    ? {

        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${cspNonce}'`],
        styleSrc: ["'self'", `'nonce-${cspNonce}'`],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", ...allowedOrigins],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      }
    : {

        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", '*'], 
      };

  return {

    contentSecurityPolicy: {

      directives: cspDirectives as any,
    } as any,

    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: {

      policy: isProduction ? 'same-origin' : 'cross-origin',
    },

    hsts: {
      maxAge: isProduction ? 31536000 : 86400, 
      includeSubDomains: true,
      preload: isProduction,
    },

    frameguard: {
      action: 'deny',
    },

    noSniff: true,

    xssFilter: true,

    dnsPrefetchControl: {
      allow: false,
    },

    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  } as any;
}






