import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Users') 
@ApiBearerAuth('Authorization')  
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))  
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    const updatedUser = await this.userService.update(userId, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser;
    return { message: 'Profile updated successfully', user: userWithoutPassword };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
    if (!deleteUserDto.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.userService.remove(+id);
  }

  // ============ ADDRESS ENDPOINTS ============

  // ✨ THÊM: Get all addresses của user
  @Get(':userId/addresses')
  @ApiOperation({ summary: 'Get all addresses of user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAddresses(@Param('userId') userId: string) {
    const addresses = await this.userService.getAddresses(+userId);
    return { addresses };
  }

  // ✨ THÊM: Get một address cụ thể
  @Get(':userId/addresses/:addressId')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address details' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getAddress(@Param('userId') userId: string, @Param('addressId') addressId: string) {
    const address = await this.userService.getAddress(+addressId);
    if (!address) {
      throw new Error('Address not found');
    }
    return { address };
  }

  // Create address
  @Post(':userId/addresses')
  @ApiOperation({ summary: 'Create new address for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createAddress(@Param('userId') userId: string, @Body() createAddressDto: CreateAddressDto) {
    const address = await this.userService.addAddress(+userId, createAddressDto);
    return { message: 'Address created successfully', address };
  }

  // Update address
  @Put(':userId/addresses/:addressId')
  @ApiOperation({ summary: 'Update address for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @Param('userId') userId: string, 
    @Param('addressId') addressId: string, 
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    const address = await this.userService.updateAddress(+addressId, updateAddressDto);
    return { message: 'Address updated successfully', address };
  }

  // ✨ THÊM: Delete address
  @Delete(':userId/addresses/:addressId')
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(@Param('userId') userId: string, @Param('addressId') addressId: string) {
    await this.userService.deleteAddress(+addressId);
    return { message: 'Address deleted successfully' };
  }

  // ✨ THÊM: Set default address
  @Put(':userId/addresses/:addressId/default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address set as default successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async setDefaultAddress(@Param('userId') userId: string, @Param('addressId') addressId: string) {
    const address = await this.userService.setDefaultAddress(+addressId, +userId);
    return { message: 'Address set as default successfully', address };
  }
}