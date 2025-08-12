"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Package, Users } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: "CUSTOMER" as "ADMIN" | "CUSTOMER",
  });

  // Ürünleri getir
  const fetchProducts = async (query?: string) => {
    setLoading(true);
    try {
      const url = query
        ? `/api/products?q=${encodeURIComponent(query)}`
        : "/api/products";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Ürünler getirilemedi");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri getir
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Kategoriler getirilemedi");
      }
    } catch (err) {
      console.error("Kategoriler getirilemedi:", err);
    }
  };

  // Kullanıcıları getir
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Kullanıcılar getirilemedi");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  // Yeni ürün ekle
  const handleAddProduct = async () => {
    setError("");
    setSuccess("");

    // Form validasyonu
    if (!newProduct.name.trim()) {
      setError("Ürün adı gerekli");
      return;
    }
    if (!newProduct.description.trim()) {
      setError("Ürün açıklaması gerekli");
      return;
    }
    if (!newProduct.categoryId) {
      setError("Kategori seçimi gerekli");
      return;
    }
    if (!newProduct.price || Number(newProduct.price) <= 0) {
      setError("Geçerli bir fiyat girin");
      return;
    }
    if (!newProduct.stock || Number(newProduct.stock) < 0) {
      setError("Geçerli bir stok miktarı girin");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }),
      });

      if (response.ok) {
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          imageUrl: "",
        });
        fetchProducts();
        setError("");
        setSuccess("Ürün başarıyla eklendi!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Ürün eklenemedi");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    }
  };

  // Yeni kullanıcı ekle
  const handleAddUser = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setNewUser({
          email: "",
          name: "",
          password: "",
          role: "CUSTOMER",
        });
        fetchUsers();
        setError("");
        setSuccess("Kullanıcı başarıyla eklendi!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Kullanıcı eklenemedi");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchCategories();
  }, []);

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const handleSearch = () => {
    fetchProducts(searchQuery);
  };

  // Read more functionality
  const toggleDescription = (productId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 100
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange(0)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 0
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Ürünler</span>
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 1
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kullanıcılar</span>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 0 && (
        <div className="space-y-6">
          {/* Ürün Arama */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Ara</span>
              </button>
            </div>
          </div>

          {/* Kategori Ekleme */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Yeni Kategori Ekle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Kategori Adı"
                id="newCategoryName"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <input
                type="text"
                placeholder="Açıklama (opsiyonel)"
                id="newCategoryDescription"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <button
                onClick={async () => {
                  setError("");
                  setSuccess("");
                  const name = (
                    document.getElementById(
                      "newCategoryName"
                    ) as HTMLInputElement
                  ).value;
                  const description = (
                    document.getElementById(
                      "newCategoryDescription"
                    ) as HTMLInputElement
                  ).value;
                  if (name) {
                    try {
                      const response = await fetch("/api/categories", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, description }),
                      });
                      if (response.ok) {
                        fetchCategories();
                        (
                          document.getElementById(
                            "newCategoryName"
                          ) as HTMLInputElement
                        ).value = "";
                        (
                          document.getElementById(
                            "newCategoryDescription"
                          ) as HTMLInputElement
                        ).value = "";
                        setSuccess("Kategori başarıyla eklendi!");
                        setTimeout(() => setSuccess(""), 3000);
                      }
                    } catch (err) {
                      console.error("Kategori eklenemedi:", err);
                    }
                  }
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 md:col-span-2"
              >
                <Plus className="w-4 h-4" />
                <span>Kategori Ekle</span>
              </button>
            </div>
          </div>

          {/* Yeni Ürün Ekleme Formu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ürün Adı"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <input
                type="number"
                placeholder="Fiyat"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <textarea
                placeholder="Açıklama"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={3}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black md:col-span-2"
              />
              <input
                type="number"
                placeholder="Stok"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <select
                value={newProduct.categoryId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categoryId: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Resim URL (opsiyonel)"
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black md:col-span-2"
              />
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 md:col-span-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ürün Ekle</span>
              </button>
            </div>
          </div>

          {/* Ürünler Listesi */}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-auto h-84 object-cover mx-auto"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <div className="text-black text-sm mb-3">
                      <p>
                        {expandedDescriptions.has(product.id)
                          ? product.description
                          : truncateDescription(product.description)}
                      </p>
                      {product.description.length > 100 && (
                        <button
                          onClick={() => toggleDescription(product.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                        >
                          {expandedDescriptions.has(product.id)
                            ? "Daha az göster"
                            : "Devamını oku"}
                        </button>
                      )}
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      ₺{product.price}
                    </div>
                    <div className="text-sm text-black">
                      Stok: {product.stock}
                    </div>
                    <div className="text-xs text-black mt-1">
                      Kategori: {product.category?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Yeni Kullanıcı Ekleme Formu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Yeni Kullanıcı Ekle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <input
                type="text"
                placeholder="İsim"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <input
                type="password"
                placeholder="Şifre"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as "ADMIN" | "CUSTOMER",
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:text-black"
              >
                <option value="CUSTOMER">Müşteri</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 md:col-span-2"
              >
                <Plus className="w-4 h-4" />
                <span>Kullanıcı Ekle</span>
              </button>
            </div>
          </div>

          {/* Kullanıcılar Listesi */}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                  <p className="text-black text-sm mb-2">{user.email}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Müşteri"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
