import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
selector: 'app-about',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './about.html'
})
export class About {
concept = [
{
title: '🖋️ 3-Line Journaling',
desc: 'เขียนบันทึกความรู้สึก เรื่องราวดี ๆ แบบสั้น ๆ วันละ 3 บรรทัด',
},
{
title: '😊 Mood Linking',
desc: 'เลือก mood ของวันนั้น ๆ เพื่อค่อย ๆ เรียนรู้หัวใจตัวเอง',
},
{
title: '🔥 Consistency First',
desc: 'ใช้ heat‑map streak และ seed flower ช่วยจูงใจให้บันทึกต่อเนื่อง (Future)',
},
];


features = [
{
title: '🗒️ Personal Dashboard',
desc: 'ดูบันทึกเก่า ๆ และเริ่มเขียนใหม่ได้ง่าย',
},
{
title: '📝 Quick Note',
desc: 'เขียนขอบคุณง่าย ๆ ไว้ก่อน — จากนั้นเพียงแค่ Login ระบบจะบันทึกคำขอบคุณให้อัตโนมัติ',
},
{
title: '📷 Image Attachments',
desc: 'เก็บภาพความทรงจำไปพร้อมกับข้อความ',
},
{
title: '📨 Positive Note via Email',
desc: 'บันทึกเชิงบวกพร้อมเก็บความทรงจำเหล่านี้เอาไว้ที่ Email',
},
{
title: '📅 Google Calendar Integration',
desc: 'บันทึกเรื่องสำคัญควบคู่กับบันทึกประจำวัน',
},
];


community = [
{
title: '💬 Share Your Stories',
desc: 'แบ่งปันเรื่องราวดี ๆ ของคุณให้คนอื่นได้อ่าน',
},
{
title: '💡 Inspire & Be Inspired',
desc: 'จุดประกายและรับแรงบันดาลใจจากผู้ใช้คนอื่น ๆ',
},
{
title: '🍃 Safe & Warm Space',
desc: 'พื้นที่ปลอดภัย อบอุ่น และให้เกียรติกัน',
},
];
}
