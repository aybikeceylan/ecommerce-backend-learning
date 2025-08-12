import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET /api/categories - Tüm kategorileri getir
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Kategoriler getirilemedi" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Yeni kategori oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Kategori adı gerekli" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kategori adı zaten mevcut" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kategori oluşturulamadı" },
      { status: 500 }
    );
  }
}
