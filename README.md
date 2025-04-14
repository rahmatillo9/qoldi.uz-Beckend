Albatta, mana sizning backend uchun `README.md` namunasi:

---

# Qoldi Backend

Bu loyiha **Qoldi** ilovasining backend qismini tashkil qiladi. Ilova, foydalanuvchilarga turli mahsulotlar haqida xabarlar yuborish, sevimli mahsulotlarini saqlash, chat xonalarida muloqot qilish imkonini beradi.

## Texnologiyalar

- **NestJS** - Backend framework
- **Sequelize** - ORM (PostgreSQL bilan ishlash uchun)
- **WebSocket (Socket.io)** - Real-time xabarlar tizimi
- **PostgreSQL** - Ma'lumotlar bazasi
- **TypeScript** - Dasturlash tili
- **Jest** - Testlash uchun

## O‘rnatish

### 1. Loyiha fayllarini klonlash

Loyihani klonlash uchun quyidagi buyruqni bajarish kerak:

```bash
git clone https://github.com/username/qoldi-backend.git
cd qoldi-backend
```

### 2. Zaruriy paketlarni o‘rnatish

Loyihadagi barcha zaruriy paketlarni o‘rnatish uchun quyidagi buyruqni bajarish kerak:

```bash
npm install
```

yoki `yarn`dan foydalanayotgan bo‘lsangiz:

```bash
yarn install
```

### 3. Ma'lumotlar bazasini sozlash

`config/config.env` faylida ma'lumotlar bazasi ulanishi uchun kerakli sozlamalarni kiriting.

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=qoldi_db
```

### 4. Migratsiyalarni ishlatish

Ma'lumotlar bazasini yaratish uchun kerakli migratsiyalarni bajarish:

```bash
npm run migrate
```

### 5. Serverni ishga tushurish

NestJS serverini ishga tushurish uchun:

```bash
npm run start:dev
```

yoki `yarn` bilan:

```bash
yarn start:dev
```

Server ishga tushgandan so‘ng, backend **`http://localhost:3000`** manzilida ishlay boshlaydi.

## API Endpoints

### 1. **Foydalanuvchilar**

- `POST /auth/register` - Foydalanuvchi ro‘yxatdan o‘tishi.
- `POST /auth/login` - Foydalanuvchi tizimga kirishi.
- `GET /users/me` - Tizimga kirgan foydalanuvchi ma'lumotlari.

### 2. **Mahsulotlar**

- `GET /products` - Barcha mahsulotlarni olish.
- `GET /products/:id` - Mahsulot haqida ma'lumot olish.
- `POST /products` - Yangi mahsulot qo‘shish.
- `PUT /products/:id` - Mahsulotni yangilash.
- `DELETE /products/:id` - Mahsulotni o‘chirish.

### 3. **Rasm**

- `POST /product-images` - Mahsulotga rasm qo‘shish.
- `DELETE /product-images/:id` - Mahsulot rasmni o‘chirish.

### 4. **Chat xonalar**

- `GET /chat-rooms` - Barcha chat xonalarini olish.
- `GET /chat-rooms/:id` - Maxsus chat xonasini olish.
- `POST /chat-rooms` - Yangi chat xonasi yaratish.

### 5. **Xabarlar**

- `POST /messages` - Yangi xabar yuborish.
- `GET /messages` - Barcha xabarlarni olish.
- `GET /messages/:id` - Maxsus xabarni olish.

### 6. **Sevimli mahsulotlar**

- `POST /favorites` - Mahsulotni sevimli qilish.
- `GET /favorites` - Foydalanuvchining sevimli mahsulotlarini olish.
- `DELETE /favorites/:id` - Mahsulotni sevimlilardan o‘chirish.

## Real-Time Chat (WebSocket)

Loyiha **WebSocket** orqali real-time chat tizimiga ega. Foydalanuvchilar chat xonalariga kirishib, xabarlar yuborishlari mumkin.

### WebSocket Server

WebSocket serveri `@nestjs/platform-socket.io` paketidan foydalanadi va `MessageGateway` yordamida xabarlar real vaqt rejimida uzatiladi.

**Tegishli URL:** `ws://localhost:3000/chat`

## Testlar

Testlarni ishga tushirish uchun:

```bash
npm run test
```

## Loyiha tuzilishi

- `src/`: Asosiy kod
  - `auth/`: Foydalanuvchi autentifikatsiyasi va avtorizatsiya
  - `chat-room/`: Chat xonalarining servis va kontrollerlari
  - `message/`: Xabarlar bilan ishlash
  - `product/`: Mahsulotlar bilan ishlash
  - `product-image/`: Mahsulot rasmlari bilan ishlash
  - `favorites/`: Foydalanuvchining sevimli mahsulotlari
  - `users/`: Foydalanuvchi ma'lumotlari
  - `common/`: Umumiy yordamchi funksiyalar va interfeyslar

## Xatoliklar va muammolar

Agar muammo yuzaga kelsa yoki xatoliklar bo‘lsa, bizning [GitHub Issues](https://github.com/username/qoldi-backend/issues) sahifamizga murojaat qiling.

## Yordam

Agar loyihani o‘rganishda yoki ishlatishda muammolar bo‘lsa, biz bilan bog‘laning:  
Email: support@qoldi.uz

---

Bu `README.md` namunasi sizning loyihangizga mos ravishda o‘zgartirilishi mumkin. Shuningdek, real-time xabarlar tizimi va WebSocket haqida ko‘proq tafsilotlar berilgan. Agar qo‘shimcha xususiyatlar kerak bo‘lsa, ular ham kiritilishi mumkin.
