import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GHNService } from './ghn.service';
import { GHNController } from './ghn.controller';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [GHNController],
  providers: [GHNService],
  exports: [GHNService],
})
export class GHNModule {}
