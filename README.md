# 🛒 E-Commerce Backend Learning Project

Bu proje, backend geliştirme öğrenmek isteyenler için tasarlanmış bir e-ticaret uygulamasıdır. TypeScript, Next.js, Prisma ve PostgreSQL kullanılarak geliştirilmiştir.

## 📚 Öğrenme Hedefleri

Bu proje ile şunları öğreneceksiniz:

- **Katmanlı Mimari (Layered Architecture)**

  - Repository Pattern
  - Service Layer
  - API Routes
  - Frontend Layer

- **Veritabanı Tasarımı**

  - PostgreSQL ile relational database
  - Prisma ORM kullanımı
  - İlişkisel veri modelleme

- **Backend Geliştirme**

  - RESTful API tasarımı
  - HTTP metodları (GET, POST, PUT, DELETE)
  - Error handling
  - Validation

- **Frontend Geliştirme**
  - Material UI ile modern UI
  - React hooks
  - API entegrasyonu

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── users/         # Kullanıcı API'leri
│   │   ├── products/      # Ürün API'leri
│   │   └── auth/          # Kimlik doğrulama API'leri
│   ├── layout.tsx         # Ana layout
│   └── page.tsx           # Ana sayfa
├── lib/                   # Utility kütüphaneleri
│   ├── prisma.ts          # Prisma client
│   ├── repositories/      # Repository katmanı
│   └── services/          # Service katmanı
└── generated/             # Prisma generated types
```

## 🗄️ Veritabanı Şeması

### Tablolar

1. **Users** - Kullanıcılar

   - id, email, name, password, role, createdAt, updatedAt

2. **Categories** - Kategoriler

   - id, name, description, imageUrl, createdAt, updatedAt

3. **Products** - Ürünler

   - id, name, description, price, stock, imageUrl, isActive, categoryId, createdAt, updatedAt

4. **Orders** - Siparişler

   - id, userId, status, totalAmount, createdAt, updatedAt

5. **OrderItems** - Sipariş detayları

   - id, orderId, productId, quantity, price, createdAt

6. **Cart** - Sepet

   - id, userId

7. **CartItems** - Sepet öğeleri
   - id, cartId, productId, quantity, createdAt

### İlişkiler

- User ↔ Order (1:N)
- User ↔ Cart (1:1)
- Category ↔ Product (1:N)
- Product ↔ OrderItem (1:N)
- Product ↔ CartItem (1:N)
- Order ↔ OrderItem (1:N)
- Cart ↔ CartItem (1:N)

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**

   ```bash
   git clone <repository-url>
   cd ecommerce-backend-learning
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   npm install
   ```

3. **Environment dosyası oluşturun**

   ```bash
   cp .env.example .env
   ```

4. **PostgreSQL veritabanı kurun**

   - PostgreSQL'i yükleyin ve çalıştırın
   - Yeni bir veritabanı oluşturun: `ecommerce_db`

5. **Environment değişkenlerini ayarlayın**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

6. **Veritabanı migration'ını çalıştırın**

   ```bash
   npx prisma migrate dev
   ```

7. **Prisma client'ı oluşturun**

   ```bash
   npx prisma generate
   ```

8. **Uygulamayı başlatın**

   ```bash
   npm run dev
   ```

9. **Tarayıcıda açın**
   ```
   http://localhost:3000
   ```

## 📖 Kullanım

### API Endpoints

#### Kullanıcılar

- `GET /api/users` - Tüm kullanıcıları getir
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/users/[id]` - Belirli kullanıcıyı getir
- `PUT /api/users/[id]` - Kullanıcı güncelle
- `DELETE /api/users/[id]` - Kullanıcı sil

#### Ürünler

- `GET /api/products` - Tüm ürünleri getir
- `GET /api/products?q=search` - Ürün ara
- `GET /api/products?category=id` - Kategoriye göre ürünler
- `POST /api/products` - Yeni ürün oluştur
- `GET /api/products/[id]` - Belirli ürünü getir
- `PUT /api/products/[id]` - Ürün güncelle
- `DELETE /api/products/[id]` - Ürün sil

#### Kimlik Doğrulama

- `POST /api/auth/login` - Kullanıcı girişi

### Frontend Özellikleri

1. **Ürünler Sekmesi**

   - Ürün arama
   - Yeni ürün ekleme
   - Ürün listesi görüntüleme

2. **Kullanıcılar Sekmesi**
   - Yeni kullanıcı ekleme
   - Kullanıcı listesi görüntüleme

## 🏛️ Mimari Açıklaması

### Repository Pattern

Veritabanı işlemlerini soyutlar ve test edilebilirliği artırır.

```typescript
// src/lib/repositories/userRepository.ts
export class UserRepository {
  async findAll(): Promise<User[]>;
  async findById(id: string): Promise<User | null>;
  async create(data: CreateUserData): Promise<User>;
  // ...
}
```

### Service Layer

Business logic'i içerir ve validasyonları yapar.

```typescript
// src/lib/services/userService.ts
export class UserService {
  async register(data: RegisterData): Promise<User>;
  async login(email: string, password: string): Promise<User>;
  // ...
}
```

### API Routes

HTTP isteklerini karşılar ve response döner.

```typescript
// src/app/api/users/route.ts
export async function GET() {
  const users = await userService.getAllUsers();
  return NextResponse.json(users);
}
```

## 🔧 Geliştirme

### Yeni özellik ekleme

1. **Veritabanı şemasını güncelleyin** (`prisma/schema.prisma`)
2. **Repository oluşturun** (`src/lib/repositories/`)
3. **Service oluşturun** (`src/lib/services/`)
4. **API route oluşturun** (`src/app/api/`)
5. **Frontend component'i oluşturun** (`src/app/`)

### Veritabanı değişiklikleri

```bash
# Migration oluştur
npx prisma migrate dev --name add_new_table

# Client'ı yeniden oluştur
npx prisma generate
```

## 🧪 Test

```bash
# Lint kontrolü
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 Öğrenme Notları

### Backend Kavramları

1. **RESTful API**: HTTP metodlarını doğru kullanma
2. **CRUD Operations**: Create, Read, Update, Delete
3. **Error Handling**: Hataları yakalama ve uygun response döndürme
4. **Validation**: Gelen verileri doğrulama
5. **Authentication**: Kullanıcı kimlik doğrulama
6. **Authorization**: Yetkilendirme (ADMIN vs CUSTOMER)

### Veritabanı Kavramları

1. **Relationships**: Tablolar arası ilişkiler
2. **Foreign Keys**: Referential integrity
3. **Indexes**: Performans optimizasyonu
4. **Transactions**: Veri tutarlılığı

### Frontend Kavramları

1. **State Management**: React hooks ile state yönetimi
2. **API Integration**: Backend ile iletişim
3. **Error Handling**: Kullanıcı dostu hata mesajları
4. **Loading States**: Yükleme durumları

## 🚀 Sonraki Adımlar

Bu temel yapıyı öğrendikten sonra şunları ekleyebilirsiniz:

1. **JWT Authentication**: Gerçek token tabanlı kimlik doğrulama
2. **File Upload**: Ürün resimleri yükleme
3. **Pagination**: Sayfalama
4. **Search & Filter**: Gelişmiş arama ve filtreleme
5. **Shopping Cart**: Sepet işlevselliği
6. **Order Management**: Sipariş yönetimi
7. **Payment Integration**: Ödeme entegrasyonu
8. **Email Notifications**: Email bildirimleri
9. **Unit Tests**: Birim testler
10. **Docker**: Containerization

## 📚 Faydalı Kaynaklar

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Katkıda Bulunma

Bu proje öğrenme amaçlıdır. Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Not**: Bu proje eğitim amaçlıdır ve production kullanımı için ek güvenlik önlemleri alınmalıdır.
