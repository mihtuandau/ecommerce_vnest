import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, user } = request;

    // Chỉ giám sát các thao tác Sửa/Xóa/Thêm (Bỏ qua thao tác Đọc - GET)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (response) => {
          try {
            // Chỉ theo dõi nội bộ Nhân viên và Admin (Bỏ qua khách hàng thường)
            if (user && user.role !== 'CUSTOMER') {
              // Bóc tách URL để biết nhân viên đang sửa cái gì (VD: /api/products -> PRODUCTS)
              const entityName = url.split('/')[2] || 'UNKNOWN'; 
              const entityId = request.params.id || body?.id || 'N/A';

              // Ghi bằng chứng vào bảng AuditLog (Két sắt)
              await this.prisma.auditLog.create({
                data: {
                  userId: user.id,
                  action: method, // POST (Tạo mới) / PATCH (Sửa) / DELETE (Xóa)
                  entityName: entityName.toUpperCase(),
                  entityId: String(entityId),
                  newData: body || {}, // Lưu lại toàn bộ dữ liệu nhân viên đã nhập
                  ipAddress: ip,
                },
              });

              this.logger.log(
                `[CAMERA AN NINH] Nhân viên ${user.email} (${user.role}) vừa thực hiện lệnh ${method} trên bảng ${entityName.toUpperCase()} (ID: ${entityId})`
              );
            }
          } catch (error) {
            this.logger.error('Lỗi khi ghi hình Camera An Ninh:', error.message);
          }
        }),
      );
    }

    return next.handle();
  }
}
