import { Address, AddressType } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type AddressEntity = Address;

export interface CreateAddressData {
  userId: number;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
  addressType: AddressType;
  isDefault: boolean;
  wardCode?: string;
  districtCode?: string;
  provinceCode?: string;
}

export type UpdateAddressData = Partial<Omit<CreateAddressData, 'userId'>>;
