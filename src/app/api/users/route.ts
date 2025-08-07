import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../lib/services/userService";

const userService = new UserService();

// GET /api/users - Tüm kullanıcıları getir (sadece admin)
export async function GET() {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Kullanıcılar getirilemedi" },
      { status: 500 }
    );
  }
}

// POST /api/users - Yeni kullanıcı oluştur (kayıt)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    // Validasyon
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, isim ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const user = await userService.register({
      email,
      name,
      password,
      role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.message === "Bu email adresi zaten kullanılıyor") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Kullanıcı oluşturulamadı" },
      { status: 500 }
    );
  }
}
