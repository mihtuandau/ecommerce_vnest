import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private aiAvailable = false;

  constructor(private prisma: PrismaService) {
    this.initializeGemini();
  }

  private initializeGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      this.logger.warn('⚠️ GEMINI_API_KEY not found. Chatbot will use database-only mode.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Dùng gemini-2.5-flash (model mới nhất)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.aiAvailable = true;
      this.logger.log('✅ Chatbot initialized with Gemini 2.5 Flash');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Gemini:', error.message);
      this.aiAvailable = false;
    }
  }

  async chat(message: string): Promise<string> {
    // Chỉ dùng Gemini AI để trả lời tất cả câu hỏi
    if (!this.aiAvailable || !this.model) {
      return 'Xin lỗi, hệ thống AI chưa sẵn sàng. Vui lòng thử lại sau.';
    }

    try {
      this.logger.log('⚡ Using Gemini AI to answer question');
      
      const prompt = `Bạn là trợ lý AI thân thiện của một cửa hàng thời trang trực tuyến. Hãy trả lời câu hỏi của khách hàng một cách ngắn gọn, hữu ích và chuyên nghiệp bằng tiếng Việt.

Câu hỏi của khách hàng: ${message}

Hãy trả lời:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return response || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.';
    } catch (error: any) {
      this.logger.error('❌ Gemini AI error:', error.message);
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return 'Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút.';
      }
      
      return 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
    }
  }

  // Xóa các hàm không dùng nữa
  /* private async fetchRelevantData(message: string): Promise<string> {
    const messageLower = message.toLowerCase();
    let contextParts: string[] = [];
    let isShopRelated = false;

    // Tìm sản phẩm
    if (this.isProductQuery(messageLower)) {
      isShopRelated = true;
      const products = await this.searchProducts(messageLower);
      if (products.length > 0) {
        contextParts.push('**SẢN PHẨM:**\n' + this.formatProducts(products));
      }
    }

    // Tìm mã giảm giá
    if (messageLower.includes('giảm giá') || messageLower.includes('khuyến mãi') || 
        messageLower.includes('mã') || messageLower.includes('voucher')) {
      isShopRelated = true;
      const discounts = await this.getActiveDiscounts();
      if (discounts.length > 0) {
        contextParts.push('**MÃ GIẢM GIÁ:**\n' + this.formatDiscounts(discounts));
      }
    }

    // Tìm danh mục
    if (messageLower.includes('loại') || messageLower.includes('danh mục')) {
      isShopRelated = true;
      const categories = await this.getCategories();
      if (categories.length > 0) {
        contextParts.push('**DANH MỤC:**\n' + this.formatCategories(categories));
      }
    }

    // Thông tin vận chuyển
    if (messageLower.includes('ship') || messageLower.includes('giao hàng') || 
        messageLower.includes('vận chuyển')) {
      isShopRelated = true;
      const shipping = await this.getShippingInfo();
      contextParts.push('**VẬN CHUYỂN:**\n' + shipping);
    }

    // Nếu KHÔNG hỏi về shop → Để AI trả lời
    if (!isShopRelated) {
      return 'KHÔNG CÓ DỮ LIỆU LIÊN QUAN';
    }

    // Nếu hỏi về shop nhưng không tìm thấy data
    return contextParts.length > 0 
      ? contextParts.join('\n\n') 
      : 'KHÔNG TÌM THẤY';
  }

  private isProductQuery(message: string): boolean {
    const productKeywords = [
      'giày', 'áo', 'quần', 'váy', 'đầm', 'nike', 'adidas', 'puma', 'converse',
      'sản phẩm', 'mua', 'có', 'tìm', 'size', 'màu', 'giá', 'bao nhiêu',
      'thể thao', 'sneaker', 'dép', 'túi', 'phụ kiện', 'bán', 'xem'
    ];
    return productKeywords.some(keyword => message.includes(keyword));
  }

  // Tách từ khóa quan trọng từ câu hỏi
  private extractKeywords(query: string): string[] {
    const brands = ['nike', 'adidas', 'puma', 'converse', 'vans', 'fila', 'new balance'];
    const categories = ['giày', 'áo', 'quần', 'váy', 'đầm', 'dép', 'sneaker', 'thể thao'];
    
    const lowercaseQuery = query.toLowerCase();
    const words = lowercaseQuery.split(/\s+/).filter(w => w.length > 2);
    
    // Tìm brands và categories trong câu
    const foundKeywords = [
      ...brands.filter(b => lowercaseQuery.includes(b)),
      ...categories.filter(c => lowercaseQuery.includes(c)),
      ...words.filter(w => w.length > 3), // Các từ dài hơn 3 ký tự
    ];
    
    return [...new Set(foundKeywords)]; // Loại trùng
  }

  private async searchProducts(query: string): Promise<any[]> {
    try {
      // Tách các từ khóa có thể có (brand, loại sản phẩm)
      const keywords = this.extractKeywords(query);
      
      // Build search conditions
      const searchConditions: any[] = [
        { name: { contains: query, mode: 'insensitive' as any } },
        { description: { contains: query, mode: 'insensitive' as any } },
        { category: { name: { contains: query, mode: 'insensitive' as any } } },
        { brand: { name: { contains: query, mode: 'insensitive' as any } } },
      ];
      
      // Thêm search cho từng keyword
      keywords.forEach(kw => {
        searchConditions.push({ name: { contains: kw, mode: 'insensitive' as any } });
        searchConditions.push({ brand: { name: { contains: kw, mode: 'insensitive' as any } } });
        searchConditions.push({ category: { name: { contains: kw, mode: 'insensitive' as any } } });
      });
      
      // Tìm tất cả sản phẩm matching
      const products = await this.prisma.product.findMany({
        where: { OR: searchConditions },
        include: {
          category: true,
          brand: true,
          variants: {
            where: { stock: { gt: 0 } },
            take: 3,
          },
        },
        take: 10, // Tăng từ 5 lên 10
      });
      
      // Log để debug
      this.logger.log(`🔍 Search query: "${query}"`);
      this.logger.log(`🔑 Keywords: ${keywords.join(', ')}`);
      this.logger.log(`📦 Found ${products.length} products`);
      
      return products;
    } catch (error) {
      this.logger.error('Error searching products:', error);
      return [];
    }
  }

  private async getActiveDiscounts(): Promise<any[]> {
    try {
      const now = new Date();
      return await this.prisma.discount.findMany({
        where: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
        take: 5,
      });
    } catch (error) {
      return [];
    }
  }

  private async getCategories(): Promise<any[]> {
    try {
      return await this.prisma.category.findMany({ take: 10 });
    } catch (error) {
      return [];
    }
  }

  private async getShippingInfo(): Promise<string> {
    try {
      const methods = await this.prisma.shippingMethod.findMany();
      return methods
        .map(m => `- ${m.name}: ${this.formatPrice(m.price)} (${m.estimatedDays} ngày)`)
        .join('\n');
    } catch (error) {
      return 'Miễn phí ship cho đơn hàng trên 500,000đ';
    }
  }

  private formatProducts(products: any[]): string {
    return products
      .map((p, i) => {
        const variants = p.variants.length > 0
          ? `\n  Có ${p.variants.length} size (${p.variants.map(v => v.size || v.color).join(', ')})`
          : '';
        return `${i + 1}. ${p.name}
  Giá: ${this.formatPrice(p.basePrice)}
  Danh mục: ${p.category?.name || 'N/A'}
  Thương hiệu: ${p.brand?.name || 'N/A'}${variants}`;
      })
      .join('\n\n');
  }

  private formatDiscounts(discounts: any[]): string {
    return discounts
      .map((d, i) => {
        const value = d.percentage 
          ? `Giảm ${d.percentage}%` 
          : `Giảm ${this.formatPrice(d.fixedAmount)}`;
        return `${i + 1}. Mã: ${d.code} - ${value}
  Mô tả: ${d.description || 'N/A'}`;
      })
      .join('\n\n');
  }

  private formatCategories(categories: any[]): string {
    return categories.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  */ // End of unused functions

  getAIStatus(): { available: boolean; provider: string } {
    return {
      available: this.aiAvailable,
      provider: this.aiAvailable ? 'Gemini AI' : 'Unavailable'
    };
  }
}
