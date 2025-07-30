# Font System Guide - Dear Me Today

## Overview
โปรเจค Dear Me Today ใช้ระบบ font แบบ dual-language ที่ออกแบบมาเพื่อรองรับทั้งภาษาอังกฤษและภาษาไทยอย่างสวยงาม

## Font Families

### 🔤 **Montserrat** (Primary - English)
- **Use for**: ข้อความภาษาอังกฤษ, ตัวเลข, สัญลักษณ์
- **Characteristics**: Modern, clean, highly readable
- **Weights**: 100-900 (Thin to Black)
- **Google Fonts**: `font-family: 'Montserrat'`

### 🇹🇭 **Prompt** (Primary - Thai)
- **Use for**: ข้อความภาษาไทย
- **Characteristics**: Thai-specific design, excellent readability
- **Weights**: 100-900 (Thin to Black)
- **Google Fonts**: `font-family: 'Prompt'`

## CSS Classes

### Utility Classes
```css
/* Thai text */
.font-thai {
  font-family: 'Prompt', 'Montserrat', system-ui, sans-serif;
  line-height: 1.7;
}

/* English text */
.font-english {
  font-family: 'Montserrat', 'Prompt', system-ui, sans-serif;
  line-height: 1.6;
}

/* Mixed content */
.font-mixed {
  font-family: 'Montserrat', 'Prompt', system-ui, sans-serif;
  line-height: 1.65;
}
```

### Tailwind Classes
```html
<!-- Thai text -->
<p class="font-thai">ข้อความภาษาไทย</p>

<!-- English text -->
<p class="font-english">English Text</p>

<!-- Mixed content -->
<p class="font-mixed">Mixed ผสมผสาน Content</p>
```

## Usage Guidelines

### 1. **Language-Specific Styling**
```html
<!-- ✅ Good -->
<h1 class="font-english">Dear me today..</h1>
<p class="font-thai">บันทึกความคิดดี ๆ วันนี้</p>

<!-- ❌ Avoid -->
<div>Dear me today.. บันทึกความคิดดี ๆ วันนี้</div>
```

### 2. **Mixed Content**
```html
<!-- ✅ Good -->
<div class="font-mixed">
  <span class="font-english">How are you feeling today?</span>
  <span class="font-thai">เลือกอารมณ์ของคุณ</span>
</div>
```

### 3. **Form Elements**
```html
<!-- Email input (English) -->
<input 
  type="email" 
  placeholder="example@gmail.com"
  class="font-english" />

<!-- Thai textarea -->
<textarea 
  placeholder="วันนี้จะเป็นวันที่ดี ฉันจะทำให้มันเป็นจริง!"
  class="font-thai"></textarea>
```

## Best Practices

### ✅ **Do's**
1. **Always specify language**: ใช้ class ที่เหมาะสมกับภาษา
2. **Consistent line-height**: Thai text ใช้ line-height สูงกว่า (1.7 vs 1.6)
3. **Fallback fonts**: มี system fonts เป็น fallback
4. **Performance**: ใช้ font-display: swap

### ❌ **Don'ts**
1. **Mixed without structure**: ไม่ผสมภาษาโดยไม่จัดโครงสร้าง
2. **Wrong font for language**: ไม่ใช้ Montserrat กับไทย หรือ Prompt กับอังกฤษเป็นหลัก
3. **Inconsistent line-height**: ไม่ผสม line-height ต่างกัน

## Implementation Examples

### Component Structure
```typescript
// hero-section.html
<h1 class="font-english">Dear me today..</h1>
<p class="font-thai">สร้างความคิดบวกวันนี้</p>

// note-form.html
<label class="font-thai">ข้อความดี ๆ สำหรับวันนี้</label>
<input class="font-english" placeholder="example@gmail.com" />
```

### Responsive Typography
```html
<!-- Mobile/Desktop responsive -->
<h1 class="text-4xl md:text-5xl font-bold font-english">
  Dear me today..
</h1>

<!-- Thai responsive -->
<p class="text-lg md:text-xl font-thai">
  บันทึกความคิดดี ๆ วันนี้
</p>
```

## Font Loading

### Google Fonts Import
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
```

### CSS Variables (Optional)
```css
:root {
  --font-english: 'Montserrat', 'Prompt', system-ui, sans-serif;
  --font-thai: 'Prompt', 'Montserrat', system-ui, sans-serif;
  --font-mixed: 'Montserrat', 'Prompt', system-ui, sans-serif;
}
```

## Performance Tips

1. **Font Preloading**: Use `preconnect` for Google Fonts
2. **Font Display**: `font-display: swap` ใน CSS
3. **Subset Loading**: โหลดเฉพาะ weights ที่ใช้
4. **Local Fallbacks**: มี system fonts เป็น fallback

## Troubleshooting

### Common Issues
1. **Font not loading**: ตรวจสอบ Google Fonts link
2. **Wrong font display**: ตรวจสอบ CSS class ว่าถูกต้อง
3. **Line-height issues**: ใช้ class ที่มี line-height เหมาะสม

### Debug Commands
```bash
# Check if fonts are loaded
console.log(document.fonts.ready);

# Check computed styles
getComputedStyle(element).fontFamily;
```

---

📝 **Note**: ระบบ font นี้ออกแบบมาเพื่อให้การอ่านและการใช้งานเป็นไปอย่างสมบูรณ์แบบทั้งภาษาไทยและภาษาอังกฤษ 