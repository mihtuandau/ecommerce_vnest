import { Module } from '@nestjs/common';
import { createCspNonceMiddleware } from './csp-nonce.middleware';


@Module({

})
export class CommonModule {}

export { createCspNonceMiddleware };






