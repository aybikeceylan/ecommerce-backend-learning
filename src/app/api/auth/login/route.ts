import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../../lib/services/userService";

const userService = new UserService();

// POST /api/auth/login - Kullanıcı girişi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasyon
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gerekli" },
        { status: 400 }
      );
    }

    const user = await userService.login(email, password);

    // JWT token oluştur (şimdilik basit response)
    // Gerçek projede JWT kullanılmalı
    return NextResponse.json({
      user,
      message: "Giriş başarılı",
    });
  } catch (error: any) {
    console.error("Error during login:", error);

    if (
      error.message === "Kullanıcı bulunamadı" ||
      error.message === "Geçersiz şifre"
    ) {
      return NextResponse.json(
        { error: "Geçersiz email veya şifre" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Giriş yapılamadı" }, { status: 500 });
  }
}
