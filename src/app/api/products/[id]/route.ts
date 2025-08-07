import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../lib/services/productService";

const productService = new ProductService();

// GET /api/products/[id] - Belirli ürünü getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productService.getProductById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Ürün getirilemedi" }, { status: 500 });
  }
}

// PUT /api/products/[id] - Ürün güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, imageUrl, isActive } =
      body;

    const product = await productService.updateProduct(params.id, {
      name,
      description,
      price: price ? Number(price) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      categoryId,
      imageUrl,
      isActive,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);

    // Business logic hatalarını yakala
    if (
      error.message.includes("Fiyat") ||
      error.message.includes("Stok") ||
      error.message.includes("adı") ||
      error.message.includes("açıklaması")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Ürün sil (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productService.deleteProduct(params.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
