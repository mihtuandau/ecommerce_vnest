import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../guards/auth.guard';


@ApiTags('Security Testing (Dev Only)')
@Controller('security')
export class SecurityController {
  
  @Get('/headers')
  @ApiOperation({
    summary: 'Get all security headers (Development Only)',
    description: `
Returns all security-related response headers.
Use this to verify your CSP, CORS, and other security configurations.

Expected headers:
-  content-security-policy
-  x-frame-options: DENY
-  x-content-type-options: nosniff
-  strict-transport-security
-  cross-origin-opener-policy
-  cross-origin-embedder-policy
-  referrer-policy
    `,
  })
  getHeaders(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res
        .status(403)
        .json({ error: 'This endpoint is only available in development' });
    }

    const headers = res.getHeaders();
    return res.json({
      headers,
      nonce: (res as any).locals?.nonce || 'No nonce generated',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }

  
  @Get('/test-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Test authenticated endpoint (Development Only)',
    description: `
Requires valid JWT token.
Use this to verify your authentication and rate limiting is working.
    `,
  })
  testAuth(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res
        .status(403)
        .json({ error: 'This endpoint is only available in development' });
    }

    return res.json({
      message: 'Authentication successful',
      headers: res.getHeaders(),
      timestamp: new Date().toISOString(),
    });
  }

  
  @Get('/csp-report')
  @ApiOperation({
    summary: 'CSP Violation Report Endpoint',
    description: 'Browser will POST CSP violations here if configured',
  })
  cspReport(@Res() res: Response) {

    return res.status(204).send();
  }
}






