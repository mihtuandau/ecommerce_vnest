import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('public/latest')
  async getLatestPublicReviews() {
    return this.reviewService.getAllReviews(1, 3);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createReview(@Body() dto: CreateReviewDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.reviewService.createReview(userId, dto);
  }

  @Get('can-review/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async canUserReview(
    @Param('productId') productId: string,
    @Query('orderId') orderId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const result = await this.reviewService.canUserReview(
      userId,
      +productId,
      +orderId,
    );
    return result;
  }

  @Get('my-review/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyReview(
    @Param('productId') productId: string,
    @Query('orderId') orderId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const review = await this.reviewService.getUserProductReview(
      userId,
      +productId,
      +orderId,
    );
    return review;
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    const userId = req.user.userId;
    return this.reviewService.getMyReviews(
      userId,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewService.getProductReviews(
      +productId,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateReview(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.reviewService.updateReview(+id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteReview(@Param('id') id: string, @Req() req: any) {
    return this.reviewService.deleteReview(+id, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getAllReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.reviewService.getAllReviews(
      page ? +page : 1,
      limit ? +limit : 20,
      productId ? +productId : undefined,
      userId ? +userId : undefined,
    );
  }
}
