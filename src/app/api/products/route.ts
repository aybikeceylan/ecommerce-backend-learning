import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../lib/services/productService";

const productService = new ProductService();

// GET /api/products - Tüm ürünleri getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("category");

    let products;

    if (categoryId) {
      products = await productService.getProductsByCategory(categoryId);
    } else if (query) {
      products = await productService.searchProducts(query);
    } else {
      products = await productService.getAllProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Ürünler getirilemedi" },
      { status: 500 }
    );
  }
}

// POST /api/products - Yeni ürün oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, imageUrl } = body;

    // Validasyon
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Ürün adı, açıklama, fiyat ve kategori gerekli" },
        { status: 400 }
      );
    }

    const product = await productService.createProduct({
      name,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId,
      imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Business logic hatalarını yakala
    if (
      error.message.includes("Fiyat") ||
      error.message.includes("Stok") ||
      error.message.includes("adı") ||
      error.message.includes("açıklaması")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 });
  }
}
