import { Module } from '@nestjs/common';
import { createCspNonceMiddleware } from './csp-nonce.middleware';

/**
 * Common Module
 * Contains shared middleware, guards, decorators, interceptors
 */
@Module({
  // This module doesn't export anything special, just organizes code
})
export class CommonModule {}

export { createCspNonceMiddleware };
