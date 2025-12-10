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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review (Authenticated users who purchased)' })
  @ApiResponse({ status: 201, description: 'Review created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createReview(@Body() dto: CreateReviewDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.reviewService.createReview(userId, dto);
  }

  @Get('can-review/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user can review this product' })
  @ApiParam({ name: 'productId', description: 'Product ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns boolean' })
  async canUserReview(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user.userId;
    const canReview = await this.reviewService.canUserReview(userId, +productId);
    return { canReview };
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a product (Public)' })
  @ApiParam({ name: 'productId', description: 'Product ID', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
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
  @ApiOperation({ summary: 'Update a review (Review owner only)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Review updated' })
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
  @ApiOperation({ summary: 'Delete a review (Review owner only)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  async deleteReview(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.reviewService.deleteReview(+id, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'productId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'All reviews retrieved' })
  async getAllReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
  ) {
    return this.reviewService.getAllReviews(
      page ? +page : 1,
      limit ? +limit : 20,
      productId ? +productId : undefined,
    );
  }
}
