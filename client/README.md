# Dear Me Today 📝✨

> A gentle, cozy space for capturing positive thoughts and building better tomorrows

พื้นที่นุ่มนวลสำหรับเก็บความคิดดี ๆ และสร้างวันพรุ่งนี้ที่ดีกว่า

## 🌟 About

**Dear Me Today** เป็นเว็บแอปพลิเคชันที่ออกแบบมาเพื่อช่วยให้คุณบันทึกความคิดบวกและสร้างกิจกรรมที่สร้างแรงบันดาลใจในชีวิตประจำวัน ด้วย **Cozy Minimal Design** ที่อบอุ่นและเรียบง่าย

### ✨ Features
- 🎨 **Cozy Minimal UI** - การออกแบบที่อบอุ่นและเรียบง่าย
- 📝 **Positive Note Taking** - บันทึกความคิดดี ๆ พร้อมกับอารมณ์
- 📸 **Image Attachments** - แนบรูปภาพได้สูงสุด 5 รูป
- 😊 **Mood Tracking** - เลือกอารมณ์และความรู้สึกของวันนั้น
- 🌐 **Dual Language** - รองรับภาษาไทยและอังกฤษ
- 📱 **Responsive Design** - ใช้งานได้ทั้ง desktop และ mobile

## 🎨 Design System

### Cozy Minimal Philosophy
- **Cozy** (อบอุ่น): สีสันอุ่น ๆ เงานุ่ม และพื้นผิวที่ให้ความรู้สึกปลอดภัย
- **Minimal** (เรียบง่าย): ลบสิ่งที่ไม่จำเป็น เน้น whitespace และ typography ที่อ่อนโยน

### Color Palette 🎨
```css
/* Cozy Colors */
--cozy-cream: #faf9f7      /* พื้นหลังหลัก */
--cozy-brown: #a8967a      /* สีหลัก */
--cozy-sage: #e8e6e1       /* เส้นขอบ */
--text-primary: #3d3d3d    /* ข้อความหลัก */
```

### Typography 📝
- **Montserrat**: สำหรับข้อความภาษาอังกฤษ
- **Prompt**: สำหรับข้อความภาษาไทย
- **Font Weight**: 300-400 เท่านั้น (เพื่อความนุ่มนวล)

## 🚀 Tech Stack

### Frontend
- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Standalone Components** - Modern Angular architecture

### Design & UI
- **Cozy Design System** - Custom design tokens
- **Responsive Layout** - Mobile-first approach
- **Glass Effects** - Modern backdrop blur
- **Custom Components** - Reusable UI elements

## 🛠️ Development

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dearmetoday/client

# Install dependencies
npm install
# or
pnpm install
```

### Development Server
```bash
# Start development server
ng serve

# Server will run on http://localhost:4200/
```

### Build for Production
```bash
# Build the application
ng build

# Build files will be in dist/ directory
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── header/          # Navigation header
│   │   ├── footer/          # Page footer
│   │   ├── hero-section/    # Landing section
│   │   ├── note-form/       # Main form component
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── home/            # Home page
│   │   ├── dashboard/       # User dashboard
│   │   └── ...
│   └── ...
├── styles.css               # Global styles & design system
└── ...
```

## 🎯 Key Components

### 1. **Hero Section**
- Minimal landing with gentle call-to-action
- Cozy icon and typography
- Smooth scroll to form

### 2. **Note Form** 
- Email input with validation
- Positive note textarea
- Mood selector (pill design)
- Multiple image upload
- Cozy button styling

### 3. **Header**
- Glass effect with backdrop blur
- Minimal navigation
- Responsive mobile menu

### 4. **Footer**
- Clean and minimal
- Essential links only
- Decorative elements

## 🌍 Internationalization

- **Thai Language**: ใช้ font Prompt และ line-height 1.8
- **English Language**: ใช้ font Montserrat และ line-height 1.7
- **Mixed Content**: รองรับเนื้อหาผสมสองภาษา

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly buttons
- Optimized spacing
- Hidden navigation with hamburger menu
- Swipe-friendly image gallery

## 🎨 Custom CSS Classes

### Cozy Components
```css
.cozy-card      /* Cards with soft shadows */
.cozy-button    /* Primary action buttons */
.cozy-input     /* Form inputs */
.mood-pill      /* Mood selector pills */
.glass-cozy     /* Glass effect containers */
```

### Typography
```css
.font-thai      /* Thai text styling */
.font-english   /* English text styling */
.font-mixed     /* Mixed content styling */
```

## 📚 Documentation

- [`COZY_DESIGN_SYSTEM.md`](./COZY_DESIGN_SYSTEM.md) - Complete design system guide
- [`FONT_GUIDE.md`](./FONT_GUIDE.md) - Typography implementation
- [`HEADER_UPDATE.md`](./HEADER_UPDATE.md) - Header glass effect guide

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e
```

## 🚀 Deployment

```bash
# Build for production
ng build --configuration production

# Deploy to your preferred hosting platform
```

## 💡 Contributing

1. Follow the Cozy Minimal design principles
2. Use only approved color palette
3. Keep typography weights ≤ 400
4. Ensure mobile responsiveness
5. Test with both Thai and English content

## 📄 License

This project is licensed under the MIT License.

---

✨ **"Building positive thoughts today for a better tomorrow"**

สร้างความคิดบวกวันนี้ เพื่ออนาคตที่ดีกว่า ✨
