import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class VNPayService {
  constructor(private configService: ConfigService) {}

  createPaymentUrl(params: {
    amount: number;
    orderInfo: string;
    orderType?: string;
    vnp_TxnRef: string;
    ipAddr: string;
  }): string {
    const tmnCode = this.configService.get('VNP_TMN_CODE')?.trim();
    const secretKey = this.configService.get('VNP_HASH_SECRET')?.trim();
    const vnpUrl = this.configService.get('VNP_URL')?.trim();
    const returnUrl = this.configService.get('VNP_RETURN_URL')?.trim();

    console.log(`[VNPayService] Config: TMN=${tmnCode ? 'OK' : 'MISSING'}, Secret=${secretKey ? 'OK' : 'MISSING'}, URL=${vnpUrl ? 'OK' : 'MISSING'}`);

    // Đảm bảo múi giờ Việt Nam
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60000)); // Hết hạn sau 15 phút

    // Xử lý IP Address: Chỉ chấp nhận định dạng IPv4 chuẩn cho VNPay
    let ipAddr = params.ipAddr;
    if (ipAddr) {
      // 1. Nếu là chuỗi nhiều IP (qua proxy/load balancer như x-forwarded-for), lấy IP đầu tiên
      if (ipAddr.includes(',')) {
        ipAddr = ipAddr.split(',')[0].trim();
      }
      // 2. Nếu là IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1)
      if (ipAddr.startsWith('::ffff:')) {
        ipAddr = ipAddr.substring(7);
      }
      // 3. Nếu là IPv6 local hoặc localhost
      if (ipAddr === '::1' || ipAddr === 'localhost') {
        ipAddr = '127.0.0.1';
      }
      // 4. Kiểm tra xem có phải IPv4 hợp lệ không, nếu không thì fallback về 127.0.0.1
      const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(ipAddr)) {
        ipAddr = '127.0.0.1';
      }
    } else {
      ipAddr = '127.0.0.1';
    }

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: params.vnp_TxnRef,
      vnp_OrderInfo: 'Thanh toan don hang ' + params.vnp_TxnRef,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(params.amount * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate, // Thêm lại vì tài liệu báo Bắt buộc
    };

    // 1. Sắp xếp key
    const sorted: any = {};
    const keys = Object.keys(vnp_Params).sort();

    // 2. Encode và nối chuỗi signData
    let signData = '';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = vnp_Params[key];
      if (val !== null && val !== undefined && val !== '') {
        const encodedKey = encodeURIComponent(key);
        const encodedVal = encodeURIComponent(val).replace(/%20/g, '+');
        if (signData.length > 0) signData += '&';
        signData += encodedKey + '=' + encodedVal;
        sorted[key] = encodedVal;
      }
    }

    // 3. Tạo chữ ký HMAC-SHA512
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // 4. Build URL cuối cùng
    return vnpUrl + '?' + signData + '&vnp_SecureHash=' + signed;
  }

  verifyReturnUrl(vnp_Params: any): { isValid: boolean; data: any } {
    const secretKey = this.configService.get('VNP_HASH_SECRET')?.trim();
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Chỉ lấy các tham số vnp_ và loại bỏ mã băm
    const filteredParams: any = {};
    Object.keys(vnp_Params).forEach((key) => {
      if (
        key.startsWith('vnp_') &&
        key !== 'vnp_SecureHash' &&
        key !== 'vnp_SecureHashType'
      ) {
        filteredParams[key] = vnp_Params[key];
      }
    });

    // Sắp xếp key theo alphabet
    const keys = Object.keys(filteredParams).sort();

    // Xây dựng chuỗi signData
    let signData = '';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = filteredParams[key];
      if (val !== null && val !== undefined && val !== '') {
        // VNPay V2.1.0: Tại bước Verify, KHÔNG encode tham số trước khi băm
        // (Chỉ encode khi tạo URL. Đây là quy tắc của VNPay)
        if (signData.length > 0) signData += '&';
        signData += key + '=' + val;
      }
    }

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // So sánh không phân biệt hoa thường
    const isValid = secureHash?.toLowerCase() === signed.toLowerCase();

    // Nếu không khớp, thử lại với logic mã hóa (dự phòng)
    if (!isValid) {
      let signDataEncoded = '';
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = filteredParams[key];
        if (val !== null && val !== undefined && val !== '') {
          const encodedKey = encodeURIComponent(key);
          const encodedVal = encodeURIComponent(val).replace(/%20/g, '+');
          if (signDataEncoded.length > 0) signDataEncoded += '&';
          signDataEncoded += encodedKey + '=' + encodedVal;
        }
      }
      const signedEncoded = crypto
        .createHmac('sha512', secretKey)
        .update(Buffer.from(signDataEncoded, 'utf-8'))
        .digest('hex');

      if (secureHash?.toLowerCase() === signedEncoded.toLowerCase()) {
        return { isValid: true, data: filteredParams };
      }
    }

    return {
      isValid: isValid,
      data: filteredParams,
    };
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }
}
