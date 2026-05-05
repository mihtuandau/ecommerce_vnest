import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
  let controller: WishlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: {
            getWishlist: jest.fn().mockResolvedValue([]),
            addToWishlist: jest.fn().mockResolvedValue({}),
            removeFromWishlist: jest.fn().mockResolvedValue({}),
            getCount: jest.fn().mockResolvedValue(0),
            isInWishlist: jest.fn().mockResolvedValue(false),
            clearWishlist: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
