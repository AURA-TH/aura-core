# AURA Development Standard

Version: 0.1
Project: AURA Intelligence Platform
Purpose: Development Rules for AI Developers
Status: Draft

---

## 1. Purpose

เอกสารนี้คือมาตรฐานการพัฒนา AURA

เป้าหมายคือทำให้ Claude, Cursor, Copilot หรือ AI Developer ตัวใดก็ตาม เขียนโค้ดไปในทิศทางเดียวกัน

AURA ต้องไม่ถูกพัฒนาแบบมั่ว
AURA ต้องถูกพัฒนาแบบมีเอกสาร มีมาตรฐาน และตรวจสอบได้

---

## 2. Golden Rule

กฎหลักที่สุด:

```text id="81578p"
ห้ามเขียนโค้ดก่อนอ่านเอกสาร
```

AI Developer ต้องอ่านเอกสารหลักก่อนเสมอ:

```text id="2qj72o"
AURA_Manifesto.md
Product_Bible.md
AI_Brain_Architecture.md
Business_Memory_Graph.md
Architecture_Overview.md
Database_Design.md
API_Design.md
Roadmap_3_Years.md
Business_Model.md
Development_Standard.md
```

---

## 3. Product Direction

AURA ไม่ใช่เว็บธรรมดา

AURA คือ AI Intelligence Platform

Product แรกคือ:

```text id="z3tzss"
AI Customer Service Employee
```

ดังนั้นการพัฒนาต้องโฟกัสที่:

* AI ตอบลูกค้า
* AI จำลูกค้า
* AI ดึงข้อมูลสินค้า
* AI สร้างคำตอบ
* เจ้าของร้านอนุมัติ
* AI สร้าง Follow-up Task
* Audit Log
* Business Memory

ห้ามหลุดไปสร้าง POS, ERP, Marketplace หรือฟีเจอร์ใหญ่ที่ยังไม่อยู่ใน MVP

---

## 4. MVP Scope

MVP แรกต้องมี:

```text id="h9ldh2"
Auth
Business Workspace
Product
Product FAQ
Customer
Conversation
Message
AI Reply
AI Memory
AI Action
Approval
Task
Audit Log
Dashboard Today
```

MVP แรกยังไม่ทำ:

```text id="lty8wp"
POS
ERP
Accounting
Payment
Shipping
Marketplace
Mobile App
Ads Automation
SEO Automation
Multi-branch
Advanced Analytics
```

---

## 5. Tech Stack

Tech Stack ที่แนะนำสำหรับ AURA MVP:

```text id="yplfxm"
Frontend: Next.js + TypeScript + Tailwind CSS
Backend: NestJS + TypeScript
Database: PostgreSQL
ORM: Prisma
Auth: JWT + Refresh Token
AI Provider: Model Router
Storage: Cloudflare R2 or S3-compatible storage
Deployment: Docker
```

หลักการ:

ใช้ของที่เสถียร เข้าใจง่าย และ AI Developer ทำงานต่อได้ดี

---

## 6. Architecture Style

AURA MVP ควรเริ่มจาก:

```text id="530aaj"
Modular Monolith
```

ไม่ควรเริ่มจาก Microservices ทันที

เหตุผล:

* พัฒนาเร็วกว่า
* Debug ง่ายกว่า
* Deploy ง่ายกว่า
* เหมาะกับทีมเล็ก
* ลดความซับซ้อน
* ขยายเป็น Service แยกได้ในอนาคต

---

## 7. Repository Structure

โครงสร้างแนะนำ:

```text id="s5qia8"
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

## 8. Coding Rules

### 8.1 TypeScript First

ทุกระบบต้องใช้ TypeScript

ห้ามใช้ `any` โดยไม่จำเป็น

ต้องกำหนด type ชัดเจนสำหรับ:

* Request
* Response
* Entity
* DTO
* Service
* AI Action
* Permission
* Error

---

### 8.2 Clean Naming

ตั้งชื่อให้เข้าใจง่าย

ตัวอย่างที่ดี:

```text id="6s7rlx"
CustomerService
ConversationService
AiReplyService
ApprovalService
AuditLogService
```

ตัวอย่างที่ไม่ดี:

```text id="225s59"
Helper
Utils
Manager
DataThing
MainService
```

---

### 8.3 Small Functions

Function ไม่ควรใหญ่เกินไป

หนึ่ง Function ควรทำงานเดียว

ถ้า Function เริ่มยาวเกินไป ต้องแยกเป็น Function ย่อย

---

### 8.4 No Hidden Logic

ห้ามซ่อน Business Logic ไว้ใน Frontend

Business Logic สำคัญต้องอยู่ใน Backend หรือ Core Package

Frontend ทำหน้าที่แสดงผลและส่งคำสั่ง

---

### 8.5 Validation First

ทุก API ต้อง Validate ข้อมูลก่อนทำงาน

ตัวอย่าง:

* email ต้องถูก format
* price ต้องเป็นตัวเลข
* business_id ต้องมีจริง
* user ต้องมีสิทธิ์
* ai_action ต้องอยู่ในสถานะที่ถูกต้อง

---

## 9. Security Rules

ทุก API ต้องตรวจ:

```text id="8ehzce"
Authentication
Authorization
Business Membership
Permission
Input Validation
Rate Limit
Audit Log
```

กฎสำคัญ:

* ห้ามให้ user เข้าถึงข้อมูลของ business อื่น
* ห้ามให้ AI ทำ Action เกิน Permission
* ห้ามส่งข้อมูลลูกค้าข้าม business
* ห้ามเก็บ secret key ในโค้ด
* ห้ามทำ Action สำคัญโดยไม่มี Audit Log
* ห้ามให้ AI ส่งข้อความสำคัญโดยไม่มี Approval ในช่วง MVP

---

## 10. AI Development Rules

AI ไม่ควรตอบจากโมเดลอย่างเดียว

AI ต้องใช้ข้อมูลจาก:

```text id="r7ff9e"
Business Profile
Product Knowledge
Product FAQ
Customer Memory
Conversation History
Business Rule
```

ทุก AI Reply ต้องมี:

```text id="xqvq2t"
draft_reply
confidence_score
reason
requires_approval
source_context
```

AI ต้องไม่:

* แต่งราคาเอง
* แต่งข้อมูลสินค้าเอง
* รับปากเรื่องส่งของโดยไม่มีข้อมูล
* เปิดเผยข้อมูลลูกค้าคนอื่น
* ตอบเรื่องที่ไม่มั่นใจโดยไม่แจ้งเตือน

---

## 11. Human Approval Rules

Action เหล่านี้ต้องรออนุมัติ:

```text id="wwmuzj"
send_message
offer_discount
change_price
delete_data
broadcast_message
create_promotion
execute_payment_related_action
```

ใน MVP:

```text id="7p04od"
AI สร้าง Draft ได้
เจ้าของร้านอนุมัติ
ระบบจึง Execute
```

---

## 12. Audit Log Rules

ทุก Action สำคัญต้องมี Audit Log

ต้องบันทึก:

```text id="ef50c7"
actor_type
actor_id
action
target_type
target_id
business_id
metadata
created_at
```

actor_type ต้องรองรับ:

```text id="l59mxa"
user
ai
system
```

---

## 13. Database Rules

ทุกตารางหลักต้องมี:

```text id="okx1yb"
id
business_id
created_at
updated_at
```

ยกเว้นตารางระดับ global เช่น users

ข้อมูลสำคัญควรใช้ soft delete หรือ status แทนการลบทันที

ทุก Query ที่เกี่ยวกับธุรกิจต้อง filter ด้วย business_id

---

## 14. API Rules

API ต้องใช้รูปแบบ:

```text id="u0i87f"
/api/v1/businesses/:business_id/resource
```

ตัวอย่าง:

```text id="od83wt"
/api/v1/businesses/:business_id/customers
/api/v1/businesses/:business_id/products
/api/v1/businesses/:business_id/conversations
```

Error Format ต้องเหมือนกันทุก API:

```json id="xvnspq"
{
  "error": {
    "code": "ERROR_CODE",
    "message": "ข้อความอธิบาย Error",
    "details": {}
  }
}
```

---

## 15. Testing Rules

ทุกฟีเจอร์หลักต้องมี Test อย่างน้อย:

```text id="od1glo"
Unit Test
Service Test
API Test
Permission Test
```

ฟีเจอร์ AI ต้องทดสอบ:

* AI ดึงข้อมูลถูกไหม
* AI ตอบจากข้อมูลจริงไหม
* Confidence Score ถูกใช้ไหม
* Action ต้อง Approval หรือไม่
* ไม่มีข้อมูลข้าม Business

---

## 16. Development Workflow

ก่อน Claude หรือ AI Developer จะเขียนโค้ด ต้องทำตามขั้นตอนนี้:

```text id="72t3qv"
1. อ่านเอกสารที่เกี่ยวข้อง
2. สรุปความเข้าใจ
3. ระบุไฟล์ที่จะสร้างหรือแก้
4. ระบุ Database ที่เกี่ยวข้อง
5. ระบุ API ที่เกี่ยวข้อง
6. เขียนโค้ด
7. ทดสอบ
8. Review ความปลอดภัย
9. สรุปสิ่งที่ทำ
```

ห้ามเขียนโค้ดทันทีโดยไม่วางแผน

---

## 17. Pull Request Standard

ทุก PR ต้องมี:

```text id="8eu9l4"
Summary
Changed Files
Database Changes
API Changes
Security Impact
AI Impact
Testing Result
Risk
```

ตัวอย่าง PR Summary:

```text id="ke81ko"
เพิ่มระบบ Customer API สำหรับสร้างและดูข้อมูลลูกค้า
```

---

## 18. AI Developer Prompt Rule

เวลาใช้ Claude หรือ AI Developer ต้องเริ่มด้วย:

```text id="yvz055"
Read the AURA documentation first.
Do not code before summarizing the relevant architecture.
Follow Development_Standard.md.
Only implement the requested MVP scope.
Do not add extra features.
```

---

## 19. Anti-Pattern

สิ่งที่ห้ามทำ:

* เขียนโค้ดก่อนออกแบบ
* เพิ่มฟีเจอร์เองโดยไม่อยู่ในเอกสาร
* ทำ UI สวยแต่ Backend ไม่พร้อม
* ให้ AI ตอบโดยไม่มีข้อมูล
* ไม่มี Audit Log
* ไม่มี Permission
* ไม่มี Validation
* ทำ Microservices เร็วเกินไป
* สร้างระบบใหญ่เกิน MVP
* ใช้ชื่อไฟล์/ฟังก์ชันที่อ่านไม่รู้เรื่อง
* Copy code โดยไม่เข้าใจผลกระทบ

---

## 20. Final Principle

AURA ต้องถูกสร้างเหมือนบริษัทเทคระดับโลก

ไม่ใช่โปรเจกต์ทดลองที่เขียนไปแก้ไป

ทุกโค้ดต้องมีเหตุผล
ทุก API ต้องมี Permission
ทุก AI Action ต้องตรวจสอบได้
ทุก Feature ต้องเชื่อมกับ Product Vision
ทุกอย่างต้องทำให้ AURA เข้าใกล้เป้าหมาย:

```text id="cykjf4"
The Business Brain
```
