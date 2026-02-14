import type { HelmetOptions } from 'helmet';
import * as crypto from 'crypto';

/**
 * Security Configuration for Helmet
 * Environment-aware settings for production vs development
 */
export function getHelmetConfig(nonce?: string): HelmetOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  // Use provided nonce or generate one
  const cspNonce = nonce || crypto.randomBytes(16).toString('base64');

  // Parse ALLOWED_ORIGINS (comma-separated) into individual URLs
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://dautuan.com')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // CSP directives - different for dev and prod
  const cspDirectives = isProduction
    ? {
        // Production: Strict CSP with nonce, no unsafe-inline
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
        // Development: More permissive for debugging
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", '*'], // Allow all in dev for testing
      };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    contentSecurityPolicy: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      directives: cspDirectives as any,
    } as any,

    // Cross-origin policies
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: {
      // Use 'same-origin' for API that only serves same origin
      // Use 'cross-origin' if API is consumed from different origins
      policy: isProduction ? 'same-origin' : 'cross-origin',
    },

    // HSTS - forces HTTPS in production
    hsts: {
      maxAge: isProduction ? 31536000 : 86400, // 1 year in prod, 1 day in dev
      includeSubDomains: true,
      preload: isProduction,
    },

    // Clickjacking protection
    frameguard: {
      action: 'deny',
    },

    // Prevent MIME type sniffing
    noSniff: true,

    // XSS filter (legacy, but still good for browsers)
    xssFilter: true,

    // DNS prefetch control
    dnsPrefetchControl: {
      allow: false,
    },

    // Referrer policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  } as any;
}
