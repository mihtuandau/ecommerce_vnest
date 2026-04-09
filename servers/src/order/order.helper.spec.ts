import { BadRequestException } from '@nestjs/common';
import { calculateOrderTotal, validateDiscount } from './order.helper';

describe('OrderHelper', () => {
  describe('calculateOrderTotal', () => {
    it('caps discount by maxDiscountAmount and never exceeds subtotal', () => {
      const totals = calculateOrderTotal(
        [
          { quantity: 2, price: 100000 },
          { quantity: 1, price: 50000 },
        ],
        30000,
        {
          percentage: 50,
          maxDiscountAmount: 80000,
        },
      );

      expect(totals.totalItems).toBe(250000);
      expect(totals.discountAmount).toBe(80000);
      expect(totals.total).toBe(280000);
      expect(totals.discountedTotal).toBe(200000);
    });
  });

  describe('validateDiscount', () => {
    const baseDiscount = {
      isActive: true,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-01-01T00:00:00.000Z'),
      minOrderAmount: 100000,
      usageLimit: 2,
    };

    it('throws when subtotal is below minOrderAmount', () => {
      expect(() => validateDiscount(baseDiscount, 50000, 0)).toThrow(BadRequestException);
    });

    it('throws when usage limit is reached', () => {
      expect(() => validateDiscount(baseDiscount, 120000, 2)).toThrow(BadRequestException);
    });

    it('passes when discount is valid', () => {
      expect(validateDiscount(baseDiscount, 120000, 1)).toBe(true);
    });
  });
});
