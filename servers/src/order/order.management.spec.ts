import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderManagement } from './order.management';

describe('OrderManagement.applyDiscount', () => {
  const repository = {
    findById: jest.fn(),
    findDiscountByCode: jest.fn(),
    countOrdersUsingDiscount: jest.fn(),
    update: jest.fn(),
    applyDiscountTransactional: jest.fn(),
  } as any;

  const cacheService = {
    clearRelatedCaches: jest.fn(),
  } as any;

  const paymentService = {} as any;
  const ghnService = {} as any;
  const mailService = {} as any;
  const notificationService = {} as any;

  let service: OrderManagement;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderManagement(
      repository,
      cacheService,
      paymentService,
      ghnService,
      mailService,
      notificationService,
    );
  });

  it('throws when order does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.applyDiscount(
        1,
        { code: 'SAVE10' },
        { userId: 10, role: 'USER' },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws when non-admin applies discount to another user order', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      userId: 99,
      status: 'PENDING',
      subtotal: 100000,
      total: 120000,
      orderItems: [{ quantity: 1, price: 100000 }],
    });

    await expect(
      service.applyDiscount(
        1,
        { code: 'SAVE10' },
        { userId: 10, role: 'USER' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when discount is flash sale', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      userId: 10,
      status: 'PENDING',
      subtotal: 100000,
      total: 120000,
      orderItems: [{ quantity: 1, price: 100000 }],
    });
    repository.findDiscountByCode.mockResolvedValue({
      id: 2,
      code: 'FLASH',
      isFlashSale: true,
      isActive: true,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-01-01T00:00:00.000Z'),
    });

    await expect(
      service.applyDiscount(1, { code: 'FLASH' }, { userId: 10, role: 'USER' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when usage limit is reached', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      userId: 10,
      status: 'PENDING',
      subtotal: 100000,
      total: 120000,
      orderItems: [{ quantity: 1, price: 100000 }],
    });
    repository.findDiscountByCode.mockResolvedValue({
      id: 2,
      code: 'SAVE10',
      isFlashSale: false,
      isActive: true,
      usageLimit: 1,
      usageCount: 1,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-01-01T00:00:00.000Z'),
      percentage: 10,
    });
    repository.countOrdersUsingDiscount.mockResolvedValue(1);

    await expect(
      service.applyDiscount(
        1,
        { code: 'SAVE10' },
        { userId: 10, role: 'USER' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('applies discount via transactional method', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      userId: 10,
      status: 'PENDING',
      subtotal: 200000,
      total: 220000,
      orderItems: [
        { quantity: 1, price: 120000 },
        { quantity: 1, price: 80000 },
      ],
    });
    repository.findDiscountByCode.mockResolvedValue({
      id: 2,
      code: 'SAVE10',
      isFlashSale: false,
      isActive: true,
      usageLimit: 100,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-01-01T00:00:00.000Z'),
      percentage: 10,
      fixedAmount: null,
      maxDiscountAmount: null,
      minOrderAmount: 0,
    });
    repository.countOrdersUsingDiscount.mockResolvedValue(10);
    repository.applyDiscountTransactional.mockResolvedValue({
      id: 1,
      total: 200000,
      discountAmount: 20000,
      subtotal: 200000,
    });

    const result = await service.applyDiscount(
      1,
      { code: 'save10' },
      { userId: 10, role: 'USER' },
    );

    expect(repository.applyDiscountTransactional).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ id: 2 }),
      expect.any(Object),
    );
    expect(cacheService.clearRelatedCaches).toHaveBeenCalledWith(1, 10);
    expect(result.message).toBe('Discount applied');
  });
});
