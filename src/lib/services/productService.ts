import { ProductRepository } from "../repositories/productRepository";
import { Product } from "../../generated/prisma";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  // Tüm ürünleri getir
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  // ID'ye göre ürün getir
  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  // Kategoriye göre ürünleri getir
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await this.productRepository.findByCategory(categoryId);
  }

  // Ürün ara
  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return await this.getAllProducts();
    }
    return await this.productRepository.search(query.trim());
  }

  // Yeni ürün oluştur
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl?: string;
  }): Promise<Product> {
    // Validasyonlar
    if (data.price <= 0) {
      throw new Error("Fiyat 0'dan büyük olmalıdır");
    }

    if (data.stock < 0) {
      throw new Error("Stok negatif olamaz");
    }

    if (!data.name.trim()) {
      throw new Error("Ürün adı boş olamaz");
    }

    if (!data.description.trim()) {
      throw new Error("Ürün açıklaması boş olamaz");
    }

    return await this.productRepository.create(data);
  }

  // Ürün güncelle
  async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
      imageUrl?: string;
      isActive?: boolean;
    }
  ): Promise<Product> {
    // Validasyonlar
    if (data.price !== undefined && data.price <= 0) {
      throw new Error("Fiyat 0'dan büyük olmalıdır");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stok negatif olamaz");
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new Error("Ürün adı boş olamaz");
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new Error("Ürün açıklaması boş olamaz");
    }

    return await this.productRepository.update(id, data);
  }

  // Ürün sil (soft delete)
  async deleteProduct(id: string): Promise<Product> {
    return await this.productRepository.delete(id);
  }

  // Stok kontrolü ve güncelleme
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Ürün bulunamadı");
    }

    if (product.stock < quantity) {
      throw new Error("Yetersiz stok");
    }

    return await this.productRepository.updateStock(id, quantity);
  }

  // Stok kontrolü (sipariş için)
  async checkStock(id: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      return false;
    }

    return product.stock >= quantity;
  }
}
