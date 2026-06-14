# AURA Architecture Overview

Version: 0.1
Project: AURA Intelligence Platform
Architecture Type: Modular AI-Native Business Platform
Status: Draft

---

## 1. Purpose

เอกสารนี้อธิบายโครงสร้างระบบ AURA ในภาพรวม

เป้าหมายคือทำให้ทุกคนและทุก AI Developer เข้าใจตรงกันว่า AURA ไม่ใช่เว็บธรรมดา แต่เป็น AI-Native Business Platform ที่มี AI Brain เป็นศูนย์กลาง

Architecture ของ AURA ต้องออกแบบให้:

* ขยายระบบได้
* แยกโมดูลชัดเจน
* รองรับ AI หลายตัว
* รองรับหลายธุรกิจ
* ปลอดภัย
* ตรวจสอบย้อนหลังได้
* ไม่ต้องรื้อใหม่เมื่อระบบโตขึ้น

---

## 2. High Level Architecture

ภาพรวมของ AURA:

```text
User / Business Owner
        ↓
AURA Web App
        ↓
AURA API
        ↓
Business Logic Layer
        ↓
Core Engines
        ↓
Database / Memory / AI Models / External Tools
```

โครงสร้างหลัก:

```text
AURA

├── Web App
├── API Server
├── Auth System
├── Business Core
├── AI Brain
├── Memory Graph
├── Workflow Engine
├── Action Engine
├── Database
├── File Storage
├── External Integrations
└── Admin System
```

---

## 3. Core Principle

AURA ต้องไม่ออกแบบแบบ Software ทั่วไปที่มี AI เป็นแค่ Feature เสริม

AURA ต้องออกแบบแบบ AI-First

หมายความว่า:

* ข้อมูลต้องถูกจัดให้ AI ใช้ได้ง่าย
* ทุก Action ต้องถูกบันทึก
* ทุก Workflow ต้องให้ AI เข้าใจ
* ทุกคำตอบต้องอ้างอิงข้อมูลจริง
* ทุกฟีเจอร์ต้องคิดว่า AI จะใช้ทำงานแทนมนุษย์ได้อย่างไร

---

## 4. Main Applications

AURA จะมี Application หลักหลายตัว

### 4.1 Business Web App

หน้าจอสำหรับเจ้าของธุรกิจ

ใช้สำหรับ:

* ดูภาพรวมธุรกิจ
* คุยกับ AI
* ตรวจคำตอบ AI
* จัดการลูกค้า
* จัดการสินค้า
* ดู Task
* ดู Insight
* อนุมัติ Action สำคัญ

### 4.2 Admin App

หน้าจอสำหรับทีม AURA

ใช้สำหรับ:

* จัดการธุรกิจที่ใช้งาน
* ตรวจระบบ
* ดู Log
* จัดการ Plan
* ตรวจ Error
* ดู Usage
* ช่วย Support ลูกค้า

### 4.3 API Server

ระบบหลังบ้านที่รับคำสั่งจาก Web App และเชื่อมต่อกับ Core Engine ทั้งหมด

### 4.4 AI Worker

ระบบเบื้องหลังที่ประมวลผลงาน AI เช่น:

* สรุปบทสนทนา
* วิเคราะห์ลูกค้า
* สร้างคำตอบ
* สร้าง Task
* วิเคราะห์ข้อมูล
* ดึงความจำที่เกี่ยวข้อง

---

## 5. Core Engines

AURA จะมี Core Engine หลักดังนี้:

```text
Core Engines

├── Auth Engine
├── Business Engine
├── Customer Engine
├── Product Engine
├── Conversation Engine
├── Memory Engine
├── AI Brain Engine
├── Workflow Engine
├── Action Engine
├── Notification Engine
└── Audit Engine
```

---

## 6. Auth Engine

Auth Engine ใช้จัดการตัวตนและสิทธิ์การใช้งาน

ต้องรองรับ:

* สมัครสมาชิก
* ล็อกอิน
* Role
* Permission
* Business Workspace
* Team Member
* Session
* Security Log

ตัวอย่าง Role:

```text
Owner
Admin
Staff
AI Agent
Viewer
```

หลักการสำคัญ:

AI Agent ต้องมีสิทธิ์เป็นของตัวเอง ไม่ควรใช้สิทธิ์เดียวกับเจ้าของร้านทุกอย่าง

---

## 7. Business Engine

Business Engine เก็บข้อมูลหลักของธุรกิจ เช่น:

* ชื่อธุรกิจ
* ประเภทธุรกิจ
* ช่องทางขาย
* เวลาทำการ
* นโยบายร้าน
* วิธีจัดส่ง
* วิธีชำระเงิน
* Tone of Voice
* เป้าหมายธุรกิจ

Business Engine คือข้อมูลพื้นฐานที่ AI ต้องใช้ก่อนตอบหรือทำงาน

---

## 8. Customer Engine

Customer Engine จัดการข้อมูลลูกค้า

ต้องรองรับ:

* ลูกค้าใหม่
* ลูกค้าเก่า
* ประวัติการซื้อ
* ประวัติแชท
* Tag
* Note
* Follow-up
* Customer Score
* Repeat Purchase Prediction

เป้าหมายคือทำให้ AI จำลูกค้าได้เหมือนพนักงานเก่า

---

## 9. Product Engine

Product Engine จัดการข้อมูลสินค้า

ต้องรองรับ:

* ชื่อสินค้า
* ราคา
* รายละเอียด
* หมวดหมู่
* แบรนด์
* สต็อก
* ต้นทุน
* กำไร
* สินค้าแนะนำคู่กัน
* FAQ ของสินค้า

Product Engine ต้องทำให้ AI แนะนำสินค้าได้ถูกต้อง ไม่มั่วราคา และไม่แต่งข้อมูลเอง

---

## 10. Conversation Engine

Conversation Engine จัดการบทสนทนา

ต้องรองรับ:

* ข้อความจากลูกค้า
* ข้อความจาก AI
* ข้อความจากพนักงาน
* สถานะบทสนทนา
* สินค้าที่กล่าวถึง
* สรุปบทสนทนา
* Sentiment
* Sales Stage
* Next Action

Conversation Engine คือฐานข้อมูลสำคัญของ AI Customer Service Employee

---

## 11. Memory Engine

Memory Engine คือระบบดึงข้อมูลที่เกี่ยวข้องให้ AI

หน้าที่:

* ดึงข้อมูลร้าน
* ดึงข้อมูลลูกค้า
* ดึงข้อมูลสินค้า
* ดึงประวัติแชท
* ดึงกฎของร้าน
* ดึงข้อมูลที่เกี่ยวข้องกับคำถาม
* ส่ง Context ให้ AI Brain

Memory Engine ต้องตอบคำถามนี้ได้:

“ข้อมูลอะไรที่ AI ต้องรู้ก่อนตอบหรือทำงานนี้”

---

## 12. AI Brain Engine

AI Brain Engine คือระบบคิด วิเคราะห์ และสร้างคำตอบ

หน้าที่:

* วิเคราะห์คำถาม
* ตีความบริบท
* เลือกข้อมูลที่เกี่ยวข้อง
* สร้างคำตอบ
* ให้ Confidence Score
* เสนอ Next Action
* ตัดสินใจว่าต้องให้มนุษย์อนุมัติหรือไม่

AI Brain Engine ไม่ควรตอบจากโมเดลอย่างเดียว ต้องตอบจากข้อมูลธุรกิจจริง

---

## 13. Workflow Engine

Workflow Engine คือระบบลำดับงาน

ตัวอย่าง Workflow:

```text
ลูกค้าถามสินค้า
↓
ตรวจว่าลูกค้าเก่าหรือใหม่
↓
ค้นหาสินค้า
↓
ตรวจสต็อก
↓
สร้างคำตอบ
↓
ให้คะแนนความมั่นใจ
↓
ส่งให้เจ้าของร้านอนุมัติ
↓
บันทึกผล
↓
สร้าง Follow-up Task
```

Workflow Engine ทำให้ AI ทำงานเป็นระบบและตรวจสอบได้

---

## 14. Action Engine

Action Engine คือระบบที่ทำให้ AI ลงมือทำได้

ตัวอย่าง Action:

* สร้าง Draft คำตอบ
* ส่งข้อความ
* สร้าง Task
* อัปเดต Customer Note
* สร้าง Insight
* แจ้งเตือนเจ้าของร้าน
* สร้างรายงาน
* สร้างข้อเสนอขาย
* สร้าง Draft โปรโมชัน

Action ที่มีความเสี่ยงต้องผ่าน Human Approval Layer

---

## 15. Human Approval Layer

Human Approval Layer คือระบบอนุมัติ

Action ที่ต้องอนุมัติ:

* ส่งข้อความสำคัญ
* เสนอส่วนลด
* ส่ง Broadcast
* เปลี่ยนราคา
* ลบข้อมูล
* ทำรายการเกี่ยวกับเงิน
* Action ที่ AI มี Confidence ต่ำ

เป้าหมายคือให้ AI ทำงานเร็ว แต่ยังปลอดภัย

---

## 16. Audit Engine

Audit Engine บันทึกทุกสิ่งที่เกิดขึ้นในระบบ

ต้องบันทึก:

* ใครทำ
* AI ตัวไหนทำ
* ทำอะไร
* ใช้ข้อมูลอะไร
* ทำเมื่อไร
* ใครอนุมัติ
* ผลลัพธ์คืออะไร
* มี Error หรือไม่

Audit Engine สำคัญสำหรับความปลอดภัย ความน่าเชื่อถือ และการ Debug

---

## 17. Database Layer

Database หลักควรใช้แบบ Relational Database สำหรับข้อมูลธุรกิจหลัก

ข้อมูลหลักที่ต้องมี:

```text
users
businesses
business_members
customers
products
conversations
messages
orders
tasks
ai_actions
ai_memories
audit_logs
```

ในอนาคตสามารถเพิ่ม Graph Database หรือ Vector Database เพื่อรองรับ Memory Graph ที่ซับซ้อนขึ้น

MVP เริ่มจาก PostgreSQL ก่อน แล้วออกแบบตารางให้รองรับ Graph-style relationship ได้

---

## 18. File Storage

File Storage ใช้เก็บ:

* รูปสินค้า
* ไฟล์เอกสาร
* รูปแชท
* ไฟล์แนบ
* รูปโปรไฟล์
* ไฟล์ที่ AI ต้องอ่าน

ระบบควรแยก File Storage ออกจาก Database

---

## 19. AI Model Layer

AURA ต้องมี Model Router

Model Router ทำหน้าที่เลือก AI Model ตามประเภทงาน

ตัวอย่าง:

```text
Customer Reply → Fast & Cheap Model
Business Analysis → Strong Reasoning Model
SEO Writing → Writing Model
Code Generation → Coding Model
Safety Review → High Accuracy Model
```

หลักการคือ AURA ไม่ผูกกับ AI เจ้าเดียว

---

## 20. External Integrations

ในอนาคต AURA ต้องเชื่อมกับระบบภายนอก เช่น:

* Facebook Page
* LINE OA
* Instagram
* TikTok Shop
* Shopee
* Lazada
* Website
* POS
* Payment
* Shipping
* Email
* Google Sheets
* Accounting Software

แต่ MVP แรกยังไม่ต้องเชื่อมทุกอย่าง

MVP แรกสามารถเริ่มจากระบบ Inbox จำลองก่อน เพื่อทดสอบ AI Customer Service Employee

---

## 21. MVP Architecture

MVP แรกควรมีโครงสร้างแบบนี้:

```text
Web App
↓
API Server
↓
PostgreSQL
↓
AI Brain Engine
↓
Memory Engine
↓
Action Engine
↓
Human Approval
```

ฟีเจอร์ที่ MVP ต้องรองรับ:

1. สมัครสมาชิก
2. สร้าง Business Workspace
3. เพิ่มข้อมูลร้าน
4. เพิ่มสินค้า
5. เพิ่ม FAQ
6. เพิ่มลูกค้า
7. ทดลองแชทกับ AI
8. AI สร้างคำตอบ
9. เจ้าของร้านอนุมัติคำตอบ
10. บันทึก Memory
11. สร้าง Follow-up Task
12. ดู Audit Log พื้นฐาน

---

## 22. Suggested Repository Structure

โครงสร้าง Repository ที่แนะนำ:

```text
aura-core/

├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── brain/
│   ├── memory/
│   ├── workflow/
│   ├── actions/
│   ├── database/
│   ├── ui/
│   └── shared/
│
├── docs/
│   ├── 00_foundation/
│   ├── 01_business/
│   ├── 02_product/
│   ├── 03_architecture/
│   ├── 04_ai/
│   ├── 05_database/
│   ├── 06_api/
│   └── 07_roadmap/
│
└── README.md
```

---

## 23. Long Term Architecture

ระยะยาว AURA ต้องรองรับ:

* หลายธุรกิจ
* หลายทีม
* หลาย AI Agent
* หลายช่องทางขาย
* หลายภาษา
* หลายประเทศ
* ระบบ Marketplace
* Plugin สำหรับแต่ละอุตสาหกรรม
* AI Employee หลายตำแหน่ง

Architecture ต้องไม่ปิดทางการขยายตัวในอนาคต

---

## 24. Final Principle

AURA Architecture ต้องถูกสร้างเพื่อให้ AI ทำงานได้จริง

ไม่ใช่แค่ให้มนุษย์กดใช้งานระบบ

ทุกข้อมูล ทุก Workflow และทุก Action ต้องถูกออกแบบให้ AI เข้าใจ ใช้งาน และตรวจสอบย้อนหลังได้

AURA จะไม่ใช่ Software ที่มี AI เป็นส่วนเสริม

AURA จะเป็น AI-Native Business Platform ที่มี Software เป็นร่างกาย และ AI Brain เป็นสมอง
