import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, AddressType } from '@prisma/client';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private repository: AddressRepository) {}

  async getAddressesByUser(userId: number) {
    return this.repository.findByUserId(userId);
  }

  async getAddress(id: number, userId: number) {
    const address = await this.repository.findById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found or does not belong to user');
    }
    return address;
  }

  async createAddress(userId: number, data: CreateAddressDto) {
    const addressCount = await this.repository.countByUserId(userId);

    const isDefault = addressCount === 0 ? true : (data.isDefault === true);

    if (isDefault) {
      await this.repository.removeDefaultFromAllAddresses(userId);
    }

    return this.repository.create({
      user: { connect: { id: userId } },
      fullName: data.fullName,
      phone: data.phone,
      street: data.street,
      ward: data.ward,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country || 'Vietnam',
      addressType: (data.addressType?.toUpperCase() || 'HOME') as AddressType,
      isDefault,
    });
  }

  async updateAddress(id: number, userId: number, data: UpdateAddressDto) {
    const address = await this.repository.findById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found or does not belong to user');
    }

    if (data.isDefault === true) {
      await this.repository.removeDefaultFromAllAddresses(userId);
    }

    const updateData: Prisma.AddressUpdateInput = {};
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.ward !== undefined) updateData.ward = data.ward;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.addressType !== undefined) updateData.addressType = data.addressType.toUpperCase() as AddressType;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    return this.repository.update(id, updateData);
  }

  async deleteAddress(id: number, userId: number) {
    const address = await this.repository.findById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found or does not belong to user');
    }

    if (address.isDefault) {
      const nextAddress = await this.repository.findNextAddress(userId, id);
      if (nextAddress) {
        await this.repository.update(nextAddress.id, { isDefault: true });
      }
    }

    return this.repository.delete(id);
  }

  async setDefaultAddress(id: number, userId: number) {
    const address = await this.repository.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const addressUserId = Number(address.userId);
    const requestUserId = Number(userId);

    if (addressUserId !== requestUserId) {
      throw new BadRequestException('Address does not belong to user');
    }

    await this.repository.removeDefaultFromAllAddresses(requestUserId);

    return this.repository.update(id, { isDefault: true });
  }

  async verifyAddressOwnership(addressId: number, userId: number): Promise<boolean> {
    const address = await this.repository.findById(addressId);
    return address ? address.userId === userId : false;
  }
}






