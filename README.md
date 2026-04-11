# Clothsess 👕

> ภาษาไทย | [English](#clothsess-english)

---

## ภาษาไทย

### ชื่อโปรเจกต์
**Clothsess** — เว็บไซต์ร้านขายเสื้อผ้าออนไลน์

### คำอธิบาย
Clothsess เป็นโปรเจกต์ Front-end เว็บไซต์ e-commerce สำหรับขายเสื้อผ้า
สร้างด้วย HTML, CSS (Tailwind CSS) และ Vanilla JavaScript ล้วนๆ ไม่ใช้ framework
ข้อมูลตะกร้าสินค้าและที่อยู่จัดส่งเก็บใน `localStorage` ของ browser

---

### Features

#### หน้าหลัก (index.html)
- **Promotion Slider** — สไลด์รูปโปรโมชัน 3 รูป กดปุ่ม prev/next เปลี่ยนรูปได้
- **Categories Filter** — กรองสินค้าตามเพศ (Men / Women) กดซ้ำเพื่อยกเลิก filter
- **Product Cards** — แสดงสินค้า 8 รายการ พร้อมรูป ชื่อ และราคา
- **Add to Cart** — กดปุ่มตะกร้าบน card เพื่อเพิ่มสินค้า ถ้าสินค้าซ้ำจะเพิ่ม qty แทน
- **Cart Badge** — icon ตะกร้าบน navbar แสดงจำนวนสินค้าปัจจุบัน

#### หน้าตะกร้าสินค้า (shoppingCart.html)
- แสดงรายการสินค้าทั้งหมดในตะกร้า
- **Select All / เลือกรายชิ้น** ด้วย checkbox
- ปรับจำนวนสินค้า (+/-) หรือลบออกจากตะกร้า
- **Order Summary** — คำนวณ subtotal, shipping fee ($1.50/ชิ้น), grand total แบบ real-time
- **Voucher / Coupon** — กรอก code `1234` เพื่อรับส่วนลด $50
- **Checkout Modal** — ยืนยันคำสั่งซื้อ แสดงที่อยู่, รายการสินค้า, วิธีชำระเงิน และยอดรวม

#### หน้าที่อยู่จัดส่ง (deliveryPage.html)
- แสดงรายการที่อยู่ที่บันทึกไว้ทั้งหมด
- เพิ่มที่อยู่ใหม่ผ่านฟอร์ม (ชื่อ, บ้านเลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์, เบอร์โทร)
- ลบที่อยู่ที่ไม่ต้องการได้
- ข้อมูลทั้งหมดเก็บใน `localStorage`

---

### โครงสร้างไฟล์

```
Clothsess/
│
├── index.html              # หน้าหลัก (แสดงสินค้า)
├── shoppingCart.html       # หน้าตะกร้าสินค้า
├── deliveryPage.html       # หน้าจัดการที่อยู่จัดส่ง
├── checkedOut.html         # หน้ายืนยันคำสั่งซื้อ (ยังไม่ได้พัฒนา)
│
├── script.js               # JavaScript ทั้งหมด (แบ่งตาม page)
├── main.css                # CSS หลัก + Tailwind directives
│
├── dist/
│   └── output.css          # CSS ที่ build จาก Tailwind (auto-generated)
│
├── package.json            # Config npm scripts สำหรับ Tailwind
├── tailwind.config.js      # Config ของ Tailwind CSS
├── portcss.config.js       # Config ของ PostCSS
│
├── logoH.svg               # โลโก้หลัก
├── promotion1.jpg          # รูปโปรโมชัน slider (1–3)
├── promotion2.jpg
├── promotion3.jpg
├── m-cloths1.png           # รูปสินค้าชาย (1–4)
├── m-cloths2.png
├── m-cloths3.png
├── m-cloths4.png
├── wm-cloths1.png          # รูปสินค้าหญิง (1–4)
├── wm-cloths2.png
├── wm-cloths3.png
├── wm-cloths4.png
│
├── Mastercard.png          # โลโก้ช่องทางชำระเงิน
├── Visa.png
├── Applepay.png
├── PayPal.png
├── Amex.png
├── Facebook-logo.svg       # โลโก้ Social Media
├── ig.png
└── linkedIn.svg
```

---

### วิธีรัน

#### 1. ติดตั้ง dependencies
```bash
npm install
```

#### 2. โหมด Development (watch — build CSS อัตโนมัติเมื่อแก้ไข)
```bash
npm run dev
```

#### 3. โหมด Production (build CSS แบบ minify)
```bash
npm run build
```

#### 4. เปิดใช้งาน
หลัง build แล้วเปิดไฟล์ `index.html` ผ่าน browser ได้เลย
หรือใช้ **Live Server** extension ใน VS Code

> **หมายเหตุ:** ต้อง build CSS ก่อนเสมอ ไฟล์ `dist/output.css` ต้องมีอยู่ก่อนที่ browser จะแสดงผลถูกต้อง

---

### เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| HTML5 | — | โครงสร้างหน้าเว็บทั้งหมด |
| CSS3 | — | ตกแต่ง custom นอกเหนือจาก Tailwind |
| Tailwind CSS | 3.4.18 | Utility-first CSS framework |
| Vanilla JavaScript | ES6+ | Logic ทั้งหมด (ไม่ใช้ framework) |
| Font Awesome | 7.0.1 | Icon ทั้งหมด (cart, user, mars, venus ฯลฯ) |
| localStorage | — | เก็บข้อมูล cart และที่อยู่จัดส่งใน browser |
| PostCSS | 8.5.6 | ประมวลผล CSS ร่วมกับ Tailwind |

---

---

# Clothsess (English)

> [ภาษาไทย](#clothsess-) | English

### Project Name
**Clothsess** — An Online Clothing Store

### Description
Clothsess is a front-end e-commerce website for selling clothing.
Built with HTML, CSS (Tailwind CSS), and pure Vanilla JavaScript — no frameworks.
Cart items and delivery addresses are persisted using the browser's `localStorage`.

---

### Features

#### Home Page (index.html)
- **Promotion Slider** — cycles through 3 promotion images with prev/next buttons
- **Categories Filter** — filter products by gender (Men / Women), click again to reset
- **Product Cards** — displays 8 products with image, name, and price
- **Add to Cart** — click the cart icon on a card to add; duplicates increment qty instead
- **Cart Badge** — navbar cart icon shows the current item count

#### Shopping Cart Page (shoppingCart.html)
- Displays all items currently in the cart
- **Select All / individual checkboxes** per item
- Adjust quantity (+/-) or remove items from the cart
- **Order Summary** — real-time calculation of subtotal, shipping fee ($1.50/item), and grand total
- **Voucher / Coupon** — enter code `1234` to receive a $50 discount
- **Checkout Modal** — confirms the order showing address, item list, payment method, and totals

#### Delivery Address Page (deliveryPage.html)
- Displays all saved delivery addresses
- Add a new address via form (name, house number, sub-district, district, province, zip code, phone)
- Delete unwanted addresses
- All data is stored in `localStorage`

---

### File Structure

```
Clothsess/
│
├── index.html              # Home page (product listing)
├── shoppingCart.html       # Shopping cart page
├── deliveryPage.html       # Delivery address management
├── checkedOut.html         # Order confirmation page (not yet implemented)
│
├── script.js               # All JavaScript logic (organized by page)
├── main.css                # Main CSS + Tailwind directives
│
├── dist/
│   └── output.css          # Tailwind build output (auto-generated)
│
├── package.json            # npm scripts config for Tailwind
├── tailwind.config.js      # Tailwind CSS config
├── portcss.config.js       # PostCSS config
│
├── logoH.svg               # Main logo
├── promotion1–3.jpg        # Slider promotion images
├── m-cloths1–4.png         # Men's product images
├── wm-cloths1–4.png        # Women's product images
└── *.png / *.svg           # Payment and social media logos
```

---

### How to Run

#### 1. Install dependencies
```bash
npm install
```

#### 2. Development mode (watch — rebuilds CSS on file change)
```bash
npm run dev
```

#### 3. Production build (minified CSS)
```bash
npm run build
```

#### 4. Open in browser
After building, open `index.html` directly in a browser,
or use the **Live Server** extension in VS Code.

> **Note:** Always build CSS first. The file `dist/output.css` must exist before the browser can render styles correctly.

---

### Technologies Used

| Technology | Version | Role |
|---|---|---|
| HTML5 | — | Page structure |
| CSS3 | — | Custom styles beyond Tailwind |
| Tailwind CSS | 3.4.18 | Utility-first CSS framework |
| Vanilla JavaScript | ES6+ | All logic (no framework) |
| Font Awesome | 7.0.1 | All icons (cart, user, mars, venus, etc.) |
| localStorage | — | Persists cart and address data in-browser |
| PostCSS | 8.5.6 | CSS processing pipeline with Tailwind |
