
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as path from 'path';
import dayjs from 'dayjs';
import * as fs from 'fs';

export class OrderInvoice {
  static async generate(order: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=HoaDon_MinhTuanShop_${order.orderCode}.pdf`,
    );

    doc.pipe(res);

    // Robust font loading with fallbacks
    const fontPaths = [
      'C:\\Windows\\Fonts\\arial.ttf', // Windows
      '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', // Linux
      path.join(process.cwd(), 'assets', 'Roboto-Regular.ttf'), // Local
    ];

    const fontBoldPaths = [
      'C:\\Windows\\Fonts\\arialbd.ttf',
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
      path.join(process.cwd(), 'assets', 'Roboto-Bold.ttf'),
    ];

    let regularFontLoaded = false;
    let boldFontLoaded = false;

    // Try to register regular font
    for (const p of fontPaths) {
      try {
        if (fs.existsSync(p)) {
          doc.registerFont('App-Regular', p);
          regularFontLoaded = true;
          break;
        }
      } catch (e) {}
    }

    // Try to register bold font
    for (const p of fontBoldPaths) {
      try {
        if (fs.existsSync(p)) {
          doc.registerFont('App-Bold', p);
          boldFontLoaded = true;
          break;
        }
      } catch (e) {}
    }

    const regFont = regularFontLoaded ? 'App-Regular' : 'Helvetica';
    const bldFont = boldFontLoaded ? 'App-Bold' : 'Helvetica-Bold';

    // Header - Two columns layout
    const leftColX = 50;
    const leftColWidth = 280;
    const rightSectionX = 350;
    const rightSectionWidth = 200;

    // Left Column: Shop Info
    doc.fontSize(18).font(bldFont).text('MINH TUẤN SHOP', leftColX, 50, { width: leftColWidth });
    doc.fontSize(9).font(regFont).text('Địa chỉ: 109/47 Đường số 8 Khu Phố 11, Phường Linh Xuân, Thành phố Thủ Đức, TP.HCM', leftColX, 75, { width: leftColWidth });
    doc.text('Hotline: 0984 340 962 | Website: dautuan.com', leftColX, 95, { width: leftColWidth });

    // Right Column: Order Title & Code
    doc.fontSize(20).font(bldFont).text('HÓA ĐƠN', rightSectionX, 50, { width: rightSectionWidth, align: 'right' });
    doc.fontSize(11).font(bldFont).text(`Số: #${order.orderCode}`, rightSectionX, 75, { width: rightSectionWidth, align: 'right' });
    doc.fontSize(10).font(regFont).text(`Ngày: ${dayjs(order.createdAt).format('DD/MM/YYYY')}`, rightSectionX, 95, { width: rightSectionWidth, align: 'right' });

    doc.moveTo(50, 120).lineTo(550, 120).stroke();

    // Customer Info & Order Meta (Side by side)
    const infoY = 140;
    doc.fontSize(12).font(bldFont).text('THÔNG TIN KHÁCH HÀNG', 50, infoY);
    const customerName = order.shippingSnapshot?.fullName || order.fullName || order.user?.name || 'Khách hàng lẻ';
    const customerPhone = order.shippingSnapshot?.phone || order.phone || order.user?.phone || 'N/A';
    const customerAddress = order.shippingSnapshot?.addressString || 
                           (order.address ? [order.address.street, order.address.ward, order.address.district, order.address.province].filter(Boolean).join(', ') : 'Mua tại quầy');

    doc.fontSize(10).font(regFont).text(`Họ tên: ${customerName}`, 50, infoY + 20);
    doc.text(`Số điện thoại: ${customerPhone}`, 50, infoY + 35);
    doc.text(`Địa chỉ: ${customerAddress}`, 50, infoY + 50, { width: 230 });

    doc.fontSize(12).font(bldFont).text('THÔNG TIN ĐƠN HÀNG', 320, infoY);
    doc.fontSize(10).font(regFont).text(`Thanh toán: ${order.paymentMethod === 'CASH' ? 'Tiền mặt' : (order.paymentMethod || 'N/A')}`, 320, infoY + 20);
    const paymentStatusLabel = order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán';
    doc.text(`Trạng thái: ${paymentStatusLabel}`, 320, infoY + 35);
    if (order.shippingCode) {
      doc.text(`Mã vận đơn: ${order.shippingCode}`, 320, infoY + 50);
    }

    // Table Header
    const tableTop = 240;
    doc.font(bldFont).fontSize(10);
    doc.text('STT', 50, tableTop);
    doc.text('Sản phẩm', 80, tableTop);
    doc.text('SL', 350, tableTop, { width: 30, align: 'center' });
    doc.text('Đơn giá', 400, tableTop, { width: 70, align: 'right' });
    doc.text('Thành tiền', 480, tableTop, { width: 70, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Items
    let currentY = tableTop + 25;
    const items = order.orderItems || [];
    
    items.forEach((item: any, i: number) => {
      doc.font(regFont).fontSize(10);
      
      // Calculate height of product name to avoid overlap
      const productName = item.productName || item.variant?.product?.name || 'Sản phẩm';
      const variantInfo = [item.variant?.color, item.variant?.size].filter(Boolean).join(' - ');
      
      const nameHeight = doc.heightOfString(productName, { width: 250 });
      
      doc.text(`${i + 1}`, 50, currentY);
      doc.text(productName, 80, currentY, { width: 250 });
      
      if (variantInfo) {
        doc.fontSize(8).text(variantInfo, 80, currentY + nameHeight + 2);
      }

      const rowHeight = Math.max(nameHeight + (variantInfo ? 15 : 0), 25);

      doc.fontSize(10).text(`${item.quantity}`, 350, currentY, { width: 30, align: 'center' });
      doc.text(`${new Intl.NumberFormat('vi-VN').format(item.price)}đ`, 400, currentY, { width: 70, align: 'right' });
      doc.text(`${new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ`, 480, currentY, { width: 70, align: 'right' });

      currentY += rowHeight + 10;
      
      // Page break if needed
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
    });

    // Totals
    let totalY = currentY + 10;
    if (totalY > 750) {
      doc.addPage();
      totalY = 50;
    }
    
    doc.moveTo(350, totalY).lineTo(550, totalY).stroke();
    
    const subtotal = order.subtotal || 0;
    const shippingFee = order.shippingFee || 0;
    const discountAmount = order.discountAmount || 0;
    const total = order.total || 0;

    const labelX = 350;
    const valueX = 450;
    const valueWidth = 100;

    doc.font(regFont).fontSize(10);
    
    doc.text('Tạm tính:', labelX, totalY + 15);
    doc.text(`${new Intl.NumberFormat('vi-VN').format(subtotal)}đ`, valueX, totalY + 15, { width: valueWidth, align: 'right' });

    doc.text('Phí vận chuyển:', labelX, totalY + 30);
    doc.text(`+${new Intl.NumberFormat('vi-VN').format(shippingFee)}đ`, valueX, totalY + 30, { width: valueWidth, align: 'right' });

    if (discountAmount > 0) {
      doc.text('Giảm giá:', labelX, totalY + 45);
      doc.text(`-${new Intl.NumberFormat('vi-VN').format(discountAmount)}đ`, valueX, totalY + 45, { width: valueWidth, align: 'right' });
    }

    doc.font(bldFont).fontSize(13).text('TỔNG CỘNG:', labelX, totalY + 65);
    doc.text(`${new Intl.NumberFormat('vi-VN').format(total)}đ`, valueX, totalY + 65, { width: valueWidth, align: 'right' });

    // Footer
    const footerY = 750;
    doc.font(regFont).fontSize(10).text('Cảm ơn quý khách đã mua sắm tại Minh Tuấn Shop!', 50, footerY, { align: 'center', width: 500 });
    doc.fontSize(8).text('Hóa đơn điện tử được tạo tự động bởi hệ thống Minh Tuấn Shop.', 50, footerY + 15, { align: 'center', width: 500 });

    doc.end();
  }
}
