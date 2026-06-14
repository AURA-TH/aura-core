# AURA API Design

Version: 0.1
Project: AURA Intelligence Platform
API Style: REST First
Status: Draft

---

## 1. Purpose

เอกสารนี้อธิบาย API หลักของ AURA เวอร์ชันแรก

API เหล่านี้จะใช้เชื่อมต่อระหว่าง:

* Web App
* Admin App
* API Server
* AI Brain
* Database
* Workflow Engine
* Action Engine

เป้าหมายคือให้ Claude หรือ AI Developer สามารถนำเอกสารนี้ไปเขียน Backend ได้อย่างเป็นระบบ

---

## 2. API Principle

หลักการออกแบบ API ของ AURA:

1. ทุก API ต้องตรวจสิทธิ์
2. ทุกข้อมูลธุรกิจต้องผูกกับ business_id
3. AI Action สำคัญต้องมี Approval
4. ทุก Action สำคัญต้องมี Audit Log
5. API ต้องอ่านง่ายและขยายได้
6. API ต้องไม่ผูกกับ AI Model ตัวเดียว
7. MVP ต้องเรียบง่าย แต่รองรับการขยายในอนาคต

---

## 3. Base URL

ตัวอย่าง Base URL:

```text
/api/v1
```

ตัวอย่าง Endpoint:

```text
/api/v1/auth/login
/api/v1/businesses
/api/v1/customers
/api/v1/products
/api/v1/conversations
/api/v1/ai/actions
```

---

## 4. Authentication

### 4.1 Register

```text
POST /api/v1/auth/register
```

ใช้สมัครสมาชิก

Request:

```json
{
  "email": "owner@example.com",
  "password": "password",
  "display_name": "Owner Name"
}
```

Response:

```json
{
  "user_id": "user_123",
  "email": "owner@example.com",
  "display_name": "Owner Name"
}
```

---

### 4.2 Login

```text
POST /api/v1/auth/login
```

ใช้เข้าสู่ระบบ

Request:

```json
{
  "email": "owner@example.com",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {
    "id": "user_123",
    "email": "owner@example.com",
    "display_name": "Owner Name"
  }
}
```

---

### 4.3 Get Current User

```text
GET /api/v1/auth/me
```

ใช้ดึงข้อมูลผู้ใช้ปัจจุบัน

---

## 5. Business API

### 5.1 Create Business

```text
POST /api/v1/businesses
```

ใช้สร้าง Business Workspace

Request:

```json
{
  "name": "PPSHOP",
  "business_type": "online_store",
  "description": "ร้านค้าออนไลน์",
  "language": "th",
  "tone_of_voice": "สุภาพ เป็นกันเอง ขายเก่ง"
}
```

Response:

```json
{
  "business_id": "biz_123",
  "name": "PPSHOP",
  "business_type": "online_store"
}
```

---

### 5.2 Get My Businesses

```text
GET /api/v1/businesses
```

ใช้ดึงรายชื่อธุรกิจที่ผู้ใช้มีสิทธิ์เข้าถึง

---

### 5.3 Get Business Detail

```text
GET /api/v1/businesses/:business_id
```

ใช้ดึงข้อมูลธุรกิจ

---

### 5.4 Update Business

```text
PATCH /api/v1/businesses/:business_id
```

ใช้แก้ไขข้อมูลธุรกิจ เช่น นโยบายร้าน วิธีส่งของ วิธีชำระเงิน และโทนการตอบลูกค้า

---

## 6. Product API

### 6.1 Create Product

```text
POST /api/v1/businesses/:business_id/products
```

ใช้เพิ่มสินค้า

Request:

```json
{
  "name": "Royal Canin Mother & Babycat",
  "sku": "RC-MB-001",
  "brand": "Royal Canin",
  "category": "อาหารแมว",
  "description": "อาหารแมวสำหรับแม่แมวและลูกแมว",
  "price": 399,
  "cost": 300,
  "stock_quantity": 20
}
```

---

### 6.2 List Products

```text
GET /api/v1/businesses/:business_id/products
```

ใช้ดูรายการสินค้า

Query ที่ควรรองรับ:

```text
search
brand
category
status
page
limit
```

---

### 6.3 Get Product Detail

```text
GET /api/v1/businesses/:business_id/products/:product_id
```

ใช้ดูรายละเอียดสินค้า

---

### 6.4 Update Product

```text
PATCH /api/v1/businesses/:business_id/products/:product_id
```

ใช้แก้ไขสินค้า

---

### 6.5 Create Product FAQ

```text
POST /api/v1/businesses/:business_id/products/:product_id/faqs
```

ใช้เพิ่มคำถามที่พบบ่อยของสินค้า

Request:

```json
{
  "question": "เหมาะกับแมวอายุกี่เดือน",
  "answer": "เหมาะสำหรับลูกแมวอายุ 1-4 เดือน และแม่แมวตั้งท้องหรือให้นม"
}
```

---

## 7. Customer API

### 7.1 Create Customer

```text
POST /api/v1/businesses/:business_id/customers
```

ใช้เพิ่มลูกค้า

Request:

```json
{
  "name": "คุณสมชาย",
  "phone": "0800000000",
  "source_channel": "facebook",
  "province": "Bangkok",
  "tags": ["ลูกค้าใหม่"]
}
```

---

### 7.2 List Customers

```text
GET /api/v1/businesses/:business_id/customers
```

Query ที่ควรรองรับ:

```text
search
tag
source_channel
status
page
limit
```

---

### 7.3 Get Customer Detail

```text
GET /api/v1/businesses/:business_id/customers/:customer_id
```

ใช้ดูข้อมูลลูกค้า รวมถึง Memory ที่เกี่ยวข้อง

---

### 7.4 Update Customer

```text
PATCH /api/v1/businesses/:business_id/customers/:customer_id
```

ใช้แก้ไขข้อมูลลูกค้า

---

### 7.5 Get Customer Memories

```text
GET /api/v1/businesses/:business_id/customers/:customer_id/memories
```

ใช้ดึงความจำของ AI เกี่ยวกับลูกค้าคนนั้น

---

## 8. Conversation API

### 8.1 Create Conversation

```text
POST /api/v1/businesses/:business_id/conversations
```

ใช้สร้างบทสนทนา

Request:

```json
{
  "customer_id": "cus_123",
  "channel": "manual_test"
}
```

---

### 8.2 List Conversations

```text
GET /api/v1/businesses/:business_id/conversations
```

Query ที่ควรรองรับ:

```text
status
channel
sales_stage
customer_id
page
limit
```

---

### 8.3 Get Conversation Detail

```text
GET /api/v1/businesses/:business_id/conversations/:conversation_id
```

ใช้ดูบทสนทนาพร้อมข้อความทั้งหมด

---

### 8.4 Add Message

```text
POST /api/v1/businesses/:business_id/conversations/:conversation_id/messages
```

ใช้เพิ่มข้อความในบทสนทนา

Request:

```json
{
  "sender_type": "customer",
  "message_type": "text",
  "content": "อาหารแมวตัวนี้มีของไหม"
}
```

---

### 8.5 List Messages

```text
GET /api/v1/businesses/:business_id/conversations/:conversation_id/messages
```

ใช้ดึงข้อความทั้งหมดในบทสนทนา

---

## 9. AI Reply API

### 9.1 Generate AI Reply

```text
POST /api/v1/businesses/:business_id/conversations/:conversation_id/ai/generate-reply
```

ใช้ให้ AI สร้างคำตอบจากข้อมูลธุรกิจ ลูกค้า สินค้า และบทสนทนา

Request:

```json
{
  "message_id": "msg_123",
  "mode": "draft"
}
```

Response:

```json
{
  "ai_action_id": "act_123",
  "draft_reply": "สินค้ายังมีพร้อมส่งค่ะ รุ่นนี้เหมาะสำหรับลูกแมวและแม่แมว...",
  "confidence_score": 92,
  "requires_approval": true,
  "reason": "พบข้อมูลสินค้าและ FAQ ที่เกี่ยวข้อง"
}
```

---

### 9.2 Regenerate AI Reply

```text
POST /api/v1/businesses/:business_id/ai/actions/:ai_action_id/regenerate
```

ใช้สร้างคำตอบใหม่

Request:

```json
{
  "instruction": "ตอบให้สั้นลง และเน้นปิดการขายมากขึ้น"
}
```

---

### 9.3 Approve AI Reply

```text
POST /api/v1/businesses/:business_id/ai/actions/:ai_action_id/approve
```

ใช้อนุมัติคำตอบจาก AI

Request:

```json
{
  "comment": "อนุมัติคำตอบนี้"
}
```

---

### 9.4 Reject AI Reply

```text
POST /api/v1/businesses/:business_id/ai/actions/:ai_action_id/reject
```

ใช้ปฏิเสธคำตอบจาก AI

Request:

```json
{
  "reason": "ข้อมูลยังไม่ครบ"
}
```

---

### 9.5 Execute AI Action

```text
POST /api/v1/businesses/:business_id/ai/actions/:ai_action_id/execute
```

ใช้สั่งให้ระบบทำ Action ที่ผ่านการอนุมัติแล้ว

ตัวอย่าง Action:

* ส่งข้อความ
* สร้าง Task
* บันทึก Memory
* อัปเดตลูกค้า

---

## 10. AI Memory API

### 10.1 Create AI Memory

```text
POST /api/v1/businesses/:business_id/ai/memories
```

ใช้สร้าง Memory ใหม่

Request:

```json
{
  "customer_id": "cus_123",
  "source_type": "conversation",
  "source_id": "conv_123",
  "memory_type": "customer_preference",
  "content": "ลูกค้าคนนี้ชอบส่ง Flash Express และมักถามเรื่องค่าส่งก่อนซื้อ",
  "confidence_score": 88,
  "importance_score": 80
}
```

---

### 10.2 List AI Memories

```text
GET /api/v1/businesses/:business_id/ai/memories
```

Query ที่ควรรองรับ:

```text
customer_id
memory_type
importance_score
page
limit
```

---

### 10.3 Update AI Memory

```text
PATCH /api/v1/businesses/:business_id/ai/memories/:memory_id
```

ใช้แก้ไข Memory

---

### 10.4 Archive AI Memory

```text
POST /api/v1/businesses/:business_id/ai/memories/:memory_id/archive
```

ใช้ปิดใช้งาน Memory ที่ไม่ถูกต้องหรือไม่ต้องใช้แล้ว

---

## 11. Task API

### 11.1 Create Task

```text
POST /api/v1/businesses/:business_id/tasks
```

ใช้สร้างงานติดตาม

Request:

```json
{
  "customer_id": "cus_123",
  "conversation_id": "conv_123",
  "title": "ติดตามลูกค้าเรื่องอาหารแมว",
  "description": "ลูกค้าสนใจ Royal Canin แต่ยังไม่ตัดสินใจ",
  "task_type": "follow_up",
  "priority": "medium",
  "due_at": "2026-06-15T10:00:00+07:00"
}
```

---

### 11.2 List Tasks

```text
GET /api/v1/businesses/:business_id/tasks
```

Query ที่ควรรองรับ:

```text
status
priority
task_type
customer_id
due_date
page
limit
```

---

### 11.3 Update Task

```text
PATCH /api/v1/businesses/:business_id/tasks/:task_id
```

---

### 11.4 Complete Task

```text
POST /api/v1/businesses/:business_id/tasks/:task_id/complete
```

---

## 12. Approval API

### 12.1 List Pending Approvals

```text
GET /api/v1/businesses/:business_id/approvals?status=pending
```

ใช้ดูรายการที่รออนุมัติ

---

### 12.2 Approve

```text
POST /api/v1/businesses/:business_id/approvals/:approval_id/approve
```

---

### 12.3 Reject

```text
POST /api/v1/businesses/:business_id/approvals/:approval_id/reject
```

---

## 13. Audit Log API

### 13.1 List Audit Logs

```text
GET /api/v1/businesses/:business_id/audit-logs
```

Query ที่ควรรองรับ:

```text
actor_type
action
target_type
from_date
to_date
page
limit
```

ใช้ตรวจสอบย้อนหลังว่าใครหรือ AI ทำอะไรในระบบ

---

## 14. Dashboard API

### 14.1 Today Summary

```text
GET /api/v1/businesses/:business_id/dashboard/today
```

Response ตัวอย่าง:

```json
{
  "pending_conversations": 12,
  "pending_approvals": 4,
  "follow_up_tasks": 7,
  "ai_replies_generated": 38,
  "high_value_customers": 5
}
```

---

## 15. Error Format

API ควรใช้ Error Format แบบเดียวกันทุกระบบ

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "ไม่พบสินค้านี้",
    "details": {}
  }
}
```

---

## 16. Permission Rules

ทุก API ต้องตรวจสอบ:

1. ผู้ใช้ล็อกอินหรือไม่
2. ผู้ใช้เป็น member ของ business นี้หรือไม่
3. ผู้ใช้มี permission ทำ action นี้หรือไม่
4. AI Agent มีสิทธิ์ทำ action นี้หรือไม่
5. Action นี้ต้อง approval หรือไม่

---

## 17. MVP API Scope

MVP แรกต้องมี API อย่างน้อย:

```text
auth
businesses
products
product_faqs
customers
conversations
messages
ai_generate_reply
ai_actions
approvals
tasks
ai_memories
audit_logs
dashboard_today
```

ยังไม่ต้องมี API สำหรับ:

```text
orders
payments
shipping
ads
seo
marketplace
accounting
multi_branch
```

---

## 18. Final Principle

API ของ AURA ต้องไม่ใช่แค่ช่องทางรับส่งข้อมูล

API ต้องเป็นเส้นประสาทของ Business Brain

ทุก API ต้องช่วยให้ AI เข้าใจธุรกิจมากขึ้น ทำงานได้ปลอดภัยขึ้น และตรวจสอบย้อนหลังได้

AURA API ต้องถูกออกแบบเพื่อให้ AI และมนุษย์ทำงานร่วมกันได้อย่างเป็นระบบ
