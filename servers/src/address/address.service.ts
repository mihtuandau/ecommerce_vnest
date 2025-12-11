import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

/**
 * Service for Address business logic
 * Handles all address-related operations
 */
@Injectable()
export class AddressService {
  constructor(private repository: AddressRepository) {}

  /**
   * Get all addresses for a user
   */
  async getAddressesByUser(userId: number) {
    return this.repository.findByUserId(userId);
  }

  /**
   * Get a specific address
   */
  async getAddress(id: number) {
    const address = await this.repository.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  /**
   * Create a new address
   */
  async createAddress(userId: number, data: CreateAddressDto) {
    // Check if user has default address
    const hasDefault = await this.repository.findDefaultByUserId(userId);

    // If no default exists, make this one default
    // If default exists and user wants this as default, remove old default
    const isDefault = !hasDefault ? true : (data.isDefault || false);

    // If new address is default, remove default from all other addresses
    if (isDefault && hasDefault) {
      await this.repository.removeDefaultFromAllAddresses(userId);
    }

    return this.repository.create({
      user: { connect: { id: userId } },
      fullName: data.fullName,
      phone: data.phoneNumber,
      street: data.specificAddress,
      ward: data.ward,
      city: data.province,
      state: data.district,
      zipCode: data.wardCode,
      addressType: data.addressType,
      isDefault,
    });
  }

  /**
   * Update an address
   */
  async updateAddress(id: number, data: UpdateAddressDto) {
    const address = await this.repository.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If setting as default, remove default from all other addresses
    if (data.isDefault) {
      await this.repository.removeDefaultFromAllAddresses(address.userId);
    }

    return this.repository.update(id, data);
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: number) {
    const address = await this.repository.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If deleting default address, set next address as default
    if (address.isDefault) {
      const nextAddress = await this.repository.findNextAddress(address.userId, id);
      if (nextAddress) {
        await this.repository.update(nextAddress.id, { isDefault: true });
      }
    }

    return this.repository.delete(id);
  }

  /**
   * Set an address as default
   */
  async setDefaultAddress(id: number, userId: number) {
    const address = await this.repository.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Address does not belong to user');
    }

    // Remove default from all user's addresses
    await this.repository.removeDefaultFromAllAddresses(userId);

    // Set this address as default
    return this.repository.update(id, { isDefault: true });
  }

  /**
   * Verify address belongs to user
   */
  async verifyAddressOwnership(addressId: number, userId: number): Promise<boolean> {
    const address = await this.repository.findById(addressId);
    return address ? address.userId === userId : false;
  }
}
