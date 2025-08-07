import { UserRepository } from "../repositories/userRepository";
import { User, UserRole } from "../../generated/prisma";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Kullanıcı kaydı
  async register(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }): Promise<Omit<User, "password">> {
    // Email kontrolü
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Bu email adresi zaten kullanılıyor");
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Kullanıcıyı oluştur
    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    });

    // Şifreyi döndürme
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Kullanıcı girişi
  async login(
    email: string,
    password: string
  ): Promise<Omit<User, "password">> {
    // Kullanıcıyı bul
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Geçersiz şifre");
    }

    // Şifreyi döndürme
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Kullanıcı bilgilerini getir
  async getUserById(id: string): Promise<Omit<User, "password"> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Tüm kullanıcıları getir (sadece admin)
  async getAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Kullanıcı güncelle
  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    }
  ): Promise<Omit<User, "password">> {
    // Email değişiyorsa kontrol et
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Bu email adresi zaten kullanılıyor");
      }
    }

    // Şifre değişiyorsa hash'le
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const user = await this.userRepository.update(id, data);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Kullanıcı sil
  async deleteUser(id: string): Promise<Omit<User, "password">> {
    const user = await this.userRepository.delete(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Kullanıcının siparişlerini getir
  async getUserOrders(userId: string) {
    return await this.userRepository.getUserOrders(userId);
  }
}
