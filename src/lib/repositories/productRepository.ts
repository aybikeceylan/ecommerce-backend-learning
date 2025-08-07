import { prisma } from "../../lib/prisma";
import { Product } from "../../generated/prisma";

export class ProductRepository {
  // Tüm ürünleri getir
  async findAll(): Promise<Product[]> {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ID'ye göre ürün getir
  async findById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  // Kategoriye göre ürünleri getir
  async findByCategory(categoryId: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Ürün ara (isim veya açıklamada)
  async search(query: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Yeni ürün oluştur
  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl?: string;
  }): Promise<Product> {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
      include: {
        category: true,
      },
    });
  }

  // Ürün güncelle
  async update(
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
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  // Ürün sil (soft delete - isActive false yap)
  async delete(id: string): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: {
        category: true,
      },
    });
  }

  // Stok güncelle
  async updateStock(id: string, quantity: number): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
      include: {
        category: true,
      },
    });
  }
}
