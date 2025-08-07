import { prisma } from "../../lib/prisma";
import { User, UserRole } from "../../generated/prisma";

export class UserRepository {
  // Tüm kullanıcıları getir
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // ID'ye göre kullanıcı getir
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Email'e göre kullanıcı getir
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Yeni kullanıcı oluştur
  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role || UserRole.CUSTOMER,
      },
    });
  }

  // Kullanıcı güncelle
  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    }
  ): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Kullanıcı sil
  async delete(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Kullanıcının siparişlerini getir
  async getUserOrders(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
