import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Định nghĩa danh sách các Permission
  const permissions = [
    { name: 'dashboard.view',  description: 'Xem tổng quan dashboard quản trị' },
    { name: 'user.manage',     description: 'Toàn quyền quản lý người dùng và phân quyền' },
    { name: 'user.view',       description: 'Xem danh sách khách hàng' },
    { name: 'product.manage',  description: 'Quản lý sản phẩm (thêm, sửa, xóa)' },
    { name: 'category.manage', description: 'Quản lý danh mục sản phẩm' },
    { name: 'order.manage',    description: 'Quản lý và xử lý đơn hàng' },
    { name: 'order.view',      description: 'Xem danh sách đơn hàng' },
    { name: 'inventory.manage',description: 'Quản lý kho hàng, nhập xuất tồn' },
    { name: 'report.view',     description: 'Xem báo cáo doanh thu và kinh doanh' },
    { name: 'chat.support',    description: 'Quản lý chat hỗ trợ khách hàng' },
    { name: 'discount.manage', description: 'Quản lý mã giảm giá và flash sale' },
    { name: 'banner.manage',   description: 'Quản lý banner và giao diện' },
    { name: 'settings.manage', description: 'Cài đặt và phân quyền hệ thống' },
    { name: 'return.manage',   description: 'Quản lý và xử lý yêu cầu đổi trả hàng' },
    { name: 'return.view',     description: 'Xem danh sách yêu cầu đổi trả' },
    { name: 'payment.manage',  description: 'Quản lý, phê duyệt và hoàn tiền giao dịch thanh toán' },
    { name: 'payment.view',    description: 'Xem danh sách và lịch sử đối soát thanh toán' },
  ];

  console.log('--- Creating Permissions ---');
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: { description: p.description },
      create: p,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  // 2. Gán quyền cho các Role
  console.log('--- Linking Permissions to Roles ---');

  // Clear cũ để tránh trùng lặp khi chạy lại seed
  await prisma.permissionRole.deleteMany({});

  const rolePermissionsMap: Record<string, string[]> = {
    [Role.ADMIN]: allPermissions.map((p) => p.name), // Admin có tất cả quyền
    [Role.KHO]: [
      'dashboard.view',
      'product.manage',
      'category.manage',
      'inventory.manage',
      'order.view',
      'return.view',
      'return.manage',
      'report.view',
    ],
    [Role.BAN_HANG]: [
      'dashboard.view',
      'order.manage',
      'order.view',
      'return.view',
      'return.manage',
      'user.view',
      'chat.support',
      'discount.manage',
      'report.view',
      'payment.view',
      'payment.manage',
    ],
    [Role.CUSTOMER]: [], // Khách hàng không có quyền truy cập trang quản trị
  };

  for (const role of Object.keys(rolePermissionsMap)) {
    const roleName = role as Role;
    const permsForRole = rolePermissionsMap[roleName];

    for (const permName of permsForRole) {
      const permission = allPermissions.find((p) => p.name === permName);
      if (permission) {
        await prisma.permissionRole.create({
          data: {
            role: roleName,
            permissionId: permission.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
