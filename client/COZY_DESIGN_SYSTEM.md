# Cozy Minimal Design System

## 🎨 Overview
Dear Me Today ได้รับการออกแบบใหม่ให้มีความรู้สึก **Cozy** (อบอุ่น นุ่มนวล) และ **Minimal** (เรียบง่าย ไม่ซับซ้อน) เพื่อสร้างพื้นที่ที่ปลอดภัยและสงบสำหรับการเขียนบันทึกความคิดดี ๆ

## 🎭 Design Philosophy

### Cozy (อบอุ่น)
- **Warmth**: ใช้สีอุ่น เบจ และครีม
- **Comfort**: พื้นผิวนุ่ม ขอบมน และเงาอ่อน
- **Intimacy**: ขนาดที่เข้าถึงได้ไม่อึดอัด

### Minimal (เรียบง่าย)
- **Simplicity**: ลบสิ่งที่ไม่จำเป็นออก
- **Whitespace**: ใช้พื้นที่ว่างอย่างมีประสิทธิภาพ
- **Focus**: เน้นที่เนื้อหาหลัก

## 🎨 Color Palette

### Primary Colors (สีหลัก)
```css
--cozy-cream: #faf9f7        /* พื้นหลังหลัก */
--cozy-warm-white: #f8f6f3   /* การ์ดและพื้นผิว */
--cozy-beige: #f0ede8        /* พื้นหลังรอง */
--cozy-sage: #e8e6e1         /* เส้นขอบ */
--cozy-taupe: #d4cfc7        /* เส้นขอบเข้ม */
```

### Action Colors (สีสำหรับการกระทำ)
```css
--cozy-brown: #a8967a        /* ปุ่มหลัก */
--cozy-dark-brown: #8b7355   /* ปุ่ม hover */
--cozy-charcoal: #4a453e     /* ข้อความเข้ม */
```

### Accent Colors (สีเสริม)
```css
--cozy-blush: #f4e6d7        /* สี hover นุ่ม */
--cozy-lavender: #e8e4f0     /* สีเสริม 1 */
--cozy-sage-green: #e1e8e1   /* สีเสริม 2 */
```

### Text Colors (สีข้อความ)
```css
--text-primary: #3d3d3d      /* ข้อความหลัก */
--text-secondary: #6b6b6b    /* ข้อความรอง */
--text-muted: #9a9a9a        /* ข้อความอ่อน */
```

## 📐 Typography

### Font Weights
- **Light (300)**: ข้อความทั่วไป, placeholders
- **Regular (400)**: หัวข้อรอง, labels
- **Medium (500)**: ไม่ใช้ (เพื่อ minimalism)
- **Bold (600+)**: ไม่ใช้ (เพื่อ minimalism)

### Line Heights
- **Thai text**: 1.8 (เนื่องจากลักษณะของตัวอักษร)
- **English text**: 1.7
- **Mixed content**: 1.75

### Heading Styles
```css
h1 { font-size: 2.5rem; font-weight: 300; }
h2 { font-size: 2rem; font-weight: 300; }
h3 { font-size: 1.5rem; font-weight: 400; }
```

## 🧩 Components

### 1. Cozy Card
```css
.cozy-card {
  background: var(--cozy-warm-white);
  border: 1px solid var(--cozy-sage);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(168, 150, 122, 0.08);
}
```

**ใช้สำหรับ**: ฟอร์ม, การ์ด, คอนเทนเนอร์หลัก

### 2. Cozy Button
```css
.cozy-button {
  background: var(--cozy-brown);
  color: var(--cozy-cream);
  border-radius: 20px;
  padding: 0.875rem 2rem;
  font-weight: 400;
  box-shadow: 0 2px 12px rgba(168, 150, 122, 0.15);
}
```

**ใช้สำหรับ**: Call-to-action, การกระทำหลัก

### 3. Cozy Input
```css
.cozy-input {
  background: var(--cozy-warm-white);
  border: 1.5px solid var(--cozy-sage);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  font-weight: 300;
}
```

**ใช้สำหรับ**: ฟิลด์ input, textarea

### 4. Mood Pills
```css
.mood-pill {
  background: var(--cozy-warm-white);
  border: 1.5px solid var(--cozy-sage);
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  font-weight: 300;
}

.mood-pill.selected {
  background: var(--cozy-brown);
  color: var(--cozy-cream);
}
```

**ใช้สำหรับ**: การเลือก mood, tags, filters

## 🌟 Effects & Interactions

### Glass Effects
```css
.glass-cozy {
  background: rgba(250, 249, 247, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 150, 122, 0.1);
}

.glass-warm {
  background: rgba(248, 246, 243, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(168, 150, 122, 0.15);
}
```

### Shadows
```css
.shadow-cozy {
  box-shadow: 0 4px 20px rgba(168, 150, 122, 0.08);
}

.shadow-cozy-lg {
  box-shadow: 0 8px 30px rgba(168, 150, 122, 0.12);
}
```

### Hover States
- **Scale**: `hover:scale-105` (เล็กน้อย)
- **Shadow**: เพิ่มเงาเล็กน้อย
- **Color**: เปลี่ยนสีแบบ subtle

## 📏 Spacing System

### Cozy Spacing
```css
.space-cozy > * + * {
  margin-top: 1.5rem;     /* 24px */
}

.space-cozy-lg > * + * {
  margin-top: 2.5rem;     /* 40px */
}
```

### Standard Spacing
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 2.5rem (40px)

## 🏗️ Layout Principles

### 1. Container Widths
- **Content**: max-w-2xl (672px)
- **Forms**: max-w-lg (512px)
- **Headers**: max-w-6xl (1152px)

### 2. Border Radius
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Pills**: 30px+

### 3. Padding Standards
- **Buttons**: 0.875rem 2rem
- **Cards**: 2rem
- **Inputs**: 1rem 1.25rem

## 🎯 Component Usage

### Hero Section
```html
<div class="flex flex-col items-center justify-center px-8 pt-32 pb-20 text-center min-h-screen">
  <!-- Minimal icon in circle -->
  <!-- Large, light typography -->
  <!-- Single CTA button -->
</div>
```

### Form Design
```html
<form class="cozy-card space-cozy-lg">
  <!-- Minimal header -->
  <!-- Cozy inputs -->
  <!-- Mood pills -->
  <!-- Single submit button -->
</form>
```

### Header
```html
<header class="glass-cozy border-b border-stone-200/50">
  <!-- Small logo -->
  <!-- Minimal navigation -->
  <!-- Single CTA -->
</header>
```

## 🎨 Implementation Examples

### Color Usage
```html
<!-- Backgrounds -->
<div class="bg-stone-50">         <!-- Light backgrounds -->
<div class="bg-stone-100">        <!-- Input backgrounds -->

<!-- Text Colors -->
<p class="text-stone-600">        <!-- Primary text -->
<p class="text-stone-500">        <!-- Secondary text -->
<p class="text-stone-400">        <!-- Muted text -->

<!-- Borders -->
<div class="border-stone-200">    <!-- Light borders -->
<div class="border-stone-300">    <!-- Medium borders -->
```

### Typography Classes
```html
<!-- Font weights -->
<p class="font-light">            <!-- 300 weight -->
<h3 class="font-normal">          <!-- 400 weight -->

<!-- Language-specific -->
<p class="font-thai">             <!-- Thai text -->
<p class="font-english">          <!-- English text -->
<p class="font-mixed">            <!-- Mixed content -->
```

## 📱 Responsive Behavior

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- ลดขนาด padding
- ซ่อน navigation บางส่วน
- ปรับขนาดข้อความ
- เพิ่มพื้นที่สำหรับนิ้ว

## ✨ Animation Guidelines

### Transitions
```css
transition: all 0.3s ease;       /* Standard */
transition: all 0.2s ease;       /* Fast interactions */
```

### Transform Effects
- **Hover**: `scale(1.05)` หรือ `translateY(-2px)`
- **Active**: `scale(0.98)`
- **Focus**: เพิ่ม ring สี cozy

## 🎪 Design Patterns

### 1. **Progressive Disclosure**
   - แสดงเฉพาะสิ่งจำเป็น
   - ซ่อนรายละเอียดใน hover/click

### 2. **Gentle Interactions**
   - Animation นุ่มนวล
   - Feedback ที่อ่อนโยน
   - ไม่มี harsh transitions

### 3. **Breathing Room**
   - เพิ่ม whitespace
   - ไม่ให้องค์ประกอบแออัด
   - ใช้ spacing อย่างสม่ำเสมอ

## 🔍 Quality Checklist

### Design
- [ ] ใช้สี cozy palette เท่านั้น
- [ ] Typography มี font-weight ไม่เกิน 400
- [ ] มี whitespace เพียงพอ
- [ ] Border radius สอดคล้องกัน
- [ ] Shadow ใช้ cozy colors

### Interaction
- [ ] Hover states นุ่มนวล
- [ ] Transitions ไม่เร็วเกินไป
- [ ] Focus states ชัดเจน
- [ ] Mobile friendly

### Accessibility
- [ ] Contrast ratio ถูกต้อง
- [ ] ขนาด touch target เพียงพอ
- [ ] เข้าถึงได้ด้วย keyboard
- [ ] Screen reader friendly

---

✨ **Remember**: Cozy Minimal Design คือการสร้างพื้นที่ที่ปลอดภัย อบอุ่น และเรียบง่าย เพื่อให้ผู้ใช้รู้สึกสบายใจในการแบ่งปันความคิดดี ๆ 