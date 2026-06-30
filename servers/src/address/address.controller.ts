import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    const address = await this.addressService.createAddress(
      req.user.userId,
      createAddressDto,
    );
    return { message: 'Address created successfully', address };
  }

  @Get()
  async findAll(@Req() req: any) {
    const addresses = await this.addressService.getAddressesByUser(
      req.user.userId,
    );
    return { addresses };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const address = await this.addressService.getAddress(+id, req.user.userId);
    return { address };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: any,
  ) {
    const address = await this.addressService.updateAddress(
      +id,
      req.user.userId,
      updateAddressDto,
    );
    return { message: 'Address updated successfully', address };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.addressService.deleteAddress(+id, req.user.userId);
    return { message: 'Address deleted successfully' };
  }

  @Patch(':id/set-default')
  async setDefault(@Param('id') id: string, @Req() req: any) {
    const address = await this.addressService.setDefaultAddress(
      +id,
      req.user.userId,
    );
    return { message: 'Address set as default successfully', address };
  }
}
