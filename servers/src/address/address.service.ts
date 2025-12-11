import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    // Check if user has any addresses
    const addressCount = await this.repository.countByUserId(userId);
    
    // First address is always default
    const isDefault = addressCount === 0 ? true : (data.isDefault === true);

    // If new address should be default, remove default from all other addresses
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
      addressType: data.addressType || 'home',
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
    if (data.isDefault === true) {
      await this.repository.removeDefaultFromAllAddresses(address.userId);
    }

    // Build update data - only include fields that are provided
    const updateData: Prisma.AddressUpdateInput = {};
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.ward !== undefined) updateData.ward = data.ward;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.addressType !== undefined) updateData.addressType = data.addressType;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    return this.repository.update(id, updateData);
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

    // Ensure both are numbers for comparison
    const addressUserId = Number(address.userId);
    const requestUserId = Number(userId);

    if (addressUserId !== requestUserId) {
      throw new BadRequestException('Address does not belong to user');
    }

    // Remove default from all user's addresses
    await this.repository.removeDefaultFromAllAddresses(requestUserId);

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
