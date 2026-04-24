import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuditLogService } from '../common/services/audit-log.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('user.view')
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  // ── Must come BEFORE @Get(':id') ──────────────────────────────────
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) throw new Error('User not found');

    const {
      password, verificationCode, verificationExpires,
      resetPasswordToken, resetPasswordExpires,
      ...safeUser
    } = user;

    // Always return fresh permissions from DB so client stays in sync
    const permissions = await this.userService.getPermissionsByRole(user.role);
    return { user: { ...safeUser, permissions } };
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    const updatedUser = await this.userService.update(userId, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser;
    return {
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const permissions = req.user.permissions || [];

    const canView = userId === id || userRole === 'ADMIN' || permissions.includes('user.view');

    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this user');
    }

    const user = await this.userService.findOne(id);
    if (!user) throw new Error('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  @Permissions('user.manage')
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const created = await this.userService.create(createUserDto);
    await this.auditLogService.write({
      action: 'USER_CREATE',
      actorId: req.user?.userId,
      targetUserId: created.id,
      details: { email: created.email },
    });
    return created;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const permissions = req.user.permissions || [];

    const isStaff = userRole === 'ADMIN' || permissions.includes('user.manage');
    const isSelf = userId === id;

    if (!isStaff && !isSelf) {
      throw new ForbiddenException('Bạn không có quyền cập nhật người dùng này');
    }

    if (!isStaff) {
      delete updateUserDto.role;
    }

    const updatedUser = await this.userService.update(id, updateUserDto);
    await this.auditLogService.write({
      action: 'USER_UPDATE',
      actorId: req.user?.userId,
      targetUserId: id,
      details: { fields: Object.keys(updateUserDto || {}) },
    });
    const { password, ...userWithoutPassword } = updatedUser;
    return {
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    };
  }

  @Delete(':id')
  @Permissions('user.manage')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteUserDto: DeleteUserDto,
    @Req() req: any,
  ) {
    if (!deleteUserDto.confirm) {
      throw new Error('Confirm deletion required');
    }

    const actorId = req.user?.userId;
    if (Number(actorId) === Number(id)) {
      await this.auditLogService.write({
        action: 'USER_DELETE_BLOCKED',
        actorId,
        targetUserId: id,
        details: { reason: 'self_delete_blocked' },
      });
      throw new ForbiddenException('Không thể tự xóa chính mình');
    }

    const hasOrders = await this.userService.hasOrders(id);
    if (hasOrders) {
      const suspended = await this.userService.deactivate(id);
      await this.auditLogService.write({
        action: 'USER_DEACTIVATE',
        actorId,
        targetUserId: id,
        details: { reason: 'has_orders' },
      });
      return {
        message: 'Tài khoản có đơn hàng nên đã được vô hiệu hóa thay vì xóa',
        user: suspended,
        action: 'DEACTIVATED',
      };
    }

    const deleted = await this.userService.remove(id);
    await this.auditLogService.write({
      action: 'USER_SOFT_DELETE',
      actorId,
      targetUserId: id,
    });
    return {
      message: 'Đã xóa mềm tài khoản người dùng',
      user: deleted,
      action: 'SOFT_DELETED',
    };
  }
}
