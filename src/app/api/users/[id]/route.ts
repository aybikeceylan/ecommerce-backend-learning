import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../../lib/services/userService";

const userService = new UserService();

// GET /api/users/[id] - Belirli kullanıcıyı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.getUserById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Kullanıcı getirilemedi" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Kullanıcı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validasyon
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const user = await userService.updateUser(params.id, {
      name,
      email,
      password,
      role,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error.message === "Bu email adresi zaten kullanılıyor") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Kullanıcı güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Kullanıcı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.deleteUser(params.id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Kullanıcı silinemedi" },
      { status: 500 }
    );
  }
}
