# AURA Database Design

Version: 0.1
Project: AURA Intelligence Platform
Database: PostgreSQL First
Status: Draft

---

## 1. Purpose

เอกสารนี้อธิบายโครงสร้างฐานข้อมูลของ AURA เวอร์ชันแรก

เป้าหมายคือออกแบบฐานข้อมูลให้รองรับ:

* ธุรกิจหลายร้าน
* ผู้ใช้หลายคน
* ลูกค้า
* สินค้า
* บทสนทนา
* AI Memory
* AI Action
* Task
* Audit Log
* Human Approval

AURA ต้องออกแบบฐานข้อมูลโดยคิดว่า AI จะเป็นผู้ใช้งานข้อมูลหลัก ไม่ใช่แค่มนุษย์

---

## 2. Database Principle

หลักการออกแบบฐานข้อมูลของ AURA:

1. ทุกข้อมูลต้องผูกกับ Business
2. ทุก Action สำคัญต้องมี Audit Log
3. ข้อมูลต้องรองรับ AI อ่านและใช้ต่อได้
4. ต้องแยกข้อมูลแต่ละธุรกิจออกจากกัน
5. ต้องเก็บ History ให้มากพอสำหรับ AI Memory
6. ต้องไม่ออกแบบให้ผูกกับ AI Model ตัวใดตัวหนึ่ง
7. MVP ต้องเรียบง่าย แต่ไม่ปิดทางขยายในอนาคต

---

## 3. Core Tables Overview

ตารางหลักของ AURA MVP:

```text id="tv1qz2"
users
businesses
business_members
customers
products
product_faqs
conversations
messages
ai_memories
ai_actions
tasks
approvals
audit_logs
```

---

## 4. users

ใช้เก็บข้อมูลผู้ใช้งานระบบ เช่น เจ้าของร้าน พนักงาน ทีมงาน AURA

### Fields

```text id="oeld4s"
id
email
password_hash
display_name
avatar_url
status
created_at
updated_at
```

### Notes

User หนึ่งคนสามารถอยู่ได้หลาย Business

ตัวอย่าง:

เจ้าของร้านหนึ่งคนมีหลายร้าน
หรือพนักงานหนึ่งคนทำงานให้หลายร้าน

---

## 5. businesses

ใช้เก็บข้อมูลธุรกิจ

### Fields

```text id="icw88y"
id
name
business_type
description
timezone
country
language
tone_of_voice
shipping_policy
payment_policy
opening_hours
status
created_at
updated_at
```

### Notes

Business คือแกนกลางของระบบ

ข้อมูลส่วนใหญ่ใน AURA ต้องผูกกับ business_id

---

## 6. business_members

ใช้เชื่อม users กับ businesses

### Fields

```text id="k4dppq"
id
business_id
user_id
role
permissions
status
created_at
updated_at
```

### Example Roles

```text id="fvxiob"
owner
admin
staff
viewer
ai_agent
```

### Notes

AI Agent ในอนาคตควรถูกมองเป็น member ชนิดหนึ่งที่มี permission จำกัด

---

## 7. customers

ใช้เก็บข้อมูลลูกค้าของแต่ละธุรกิจ

### Fields

```text id="fsfw6z"
id
business_id
name
phone
email
source_channel
external_id
province
tags
notes
customer_score
last_contact_at
last_purchase_at
next_follow_up_at
status
created_at
updated_at
```

### Notes

Customer คือหัวใจของ AI Memory

AI ต้องใช้ข้อมูลนี้เพื่อตอบลูกค้าให้เหมือนพนักงานที่จำลูกค้าได้

---

## 8. products

ใช้เก็บข้อมูลสินค้า

### Fields

```text id="znp4zg"
id
business_id
name
sku
brand
category
description
price
cost
stock_quantity
image_url
status
created_at
updated_at
```

### Notes

Product ต้องเก็บข้อมูลให้ AI ใช้ขายได้ ไม่ใช่แค่ให้ระบบโชว์ราคา

ข้อมูลที่ควรเก็บในอนาคต:

* จุดเด่นสินค้า
* เหมาะกับใคร
* วิธีใช้
* คำเตือน
* สินค้าที่ควรขายคู่กัน
* สินค้าทดแทน

---

## 9. product_faqs

ใช้เก็บคำถามที่พบบ่อยของสินค้า

### Fields

```text id="b8nk2z"
id
business_id
product_id
question
answer
status
created_at
updated_at
```

### Notes

AI ควรใช้ product_faqs เป็นแหล่งข้อมูลหลักเวลาตอบคำถามเกี่ยวกับสินค้า

---

## 10. conversations

ใช้เก็บบทสนทนา

### Fields

```text id="jiw37d"
id
business_id
customer_id
channel
external_thread_id
status
sales_stage
summary
last_message_at
created_at
updated_at
```

### Example Status

```text id="tmhty2"
open
waiting_owner
waiting_customer
closed
archived
```

### Example Sales Stage

```text id="u7p4ch"
new_lead
interested
considering
ready_to_buy
purchased
lost
follow_up
```

---

## 11. messages

ใช้เก็บข้อความทั้งหมดในบทสนทนา

### Fields

```text id="ku5ub4"
id
business_id
conversation_id
customer_id
sender_type
sender_id
message_type
content
metadata
ai_confidence_score
created_at
```

### sender_type

```text id="tpyywa"
customer
user
ai
system
```

### message_type

```text id="4yrgtn"
text
image
file
system_note
ai_suggestion
```

### Notes

messages สำคัญมาก เพราะเป็นข้อมูลหลักที่ AI ใช้เรียนรู้บริบทของลูกค้า

---

## 12. ai_memories

ใช้เก็บความจำที่ AI สรุปออกมาจากข้อมูลจริง

### Fields

```text id="fbccnp"
id
business_id
customer_id
source_type
source_id
memory_type
content
confidence_score
importance_score
status
created_at
updated_at
```

### memory_type

```text id="vsqsez"
customer_preference
purchase_pattern
conversation_summary
business_rule
product_insight
follow_up_note
decision_note
```

### Example

```text id="mvb14o"
ลูกค้าคนนี้ชอบส่ง Flash Express และมักซื้อซ้ำทุก 30 วัน
```

### Notes

ai_memories คือชั้นแรกของ Business Memory Graph

MVP อาจยังไม่ต้องใช้ Graph Database จริง แต่ต้องเก็บความจำในรูปแบบที่ขยายเป็น Graph ได้

---

## 13. ai_actions

ใช้เก็บ Action ที่ AI สร้างหรือทำ

### Fields

```text id="9dclog"
id
business_id
conversation_id
customer_id
action_type
title
description
payload
status
confidence_score
created_by_ai_model
created_at
updated_at
```

### action_type

```text id="a7gu7v"
draft_reply
send_message
create_task
update_customer
recommend_product
create_promotion_draft
summarize_conversation
follow_up_customer
```

### status

```text id="3g23x9"
draft
pending_approval
approved
rejected
executed
failed
cancelled
```

---

## 14. approvals

ใช้เก็บการอนุมัติจากมนุษย์

### Fields

```text id="ke4x8j"
id
business_id
ai_action_id
requested_by
approved_by
status
comment
created_at
updated_at
```

### status

```text id="xpx9vi"
pending
approved
rejected
expired
```

### Notes

Action ที่มีความเสี่ยงต้องผ่าน approvals ก่อนเสมอ

---

## 15. tasks

ใช้เก็บงานติดตาม

### Fields

```text id="dldz6b"
id
business_id
customer_id
conversation_id
title
description
task_type
priority
due_at
assigned_to
created_by
status
created_at
updated_at
```

### task_type

```text id="lissrr"
follow_up
customer_issue
sales_opportunity
owner_review
stock_check
manual_task
```

### priority

```text id="hjwhfu"
low
medium
high
urgent
```

### status

```text id="zw6vz4"
todo
in_progress
done
cancelled
```

---

## 16. audit_logs

ใช้เก็บประวัติการกระทำทั้งหมด

### Fields

```text id="o8hno4"
id
business_id
actor_type
actor_id
action
target_type
target_id
metadata
created_at
```

### actor_type

```text id="p11zfi"
user
ai
system
```

### Notes

audit_logs สำคัญมากสำหรับระบบ AI

ต้องรู้ว่า AI ทำอะไร ใช้ข้อมูลอะไร และใครอนุมัติ

---

## 17. Data Relationship Overview

ความสัมพันธ์หลักของข้อมูล:

```text id="ob8rr5"
User
↓
Business Member
↓
Business
↓
Customers
↓
Conversations
↓
Messages
↓
AI Memories
↓
AI Actions
↓
Approvals / Tasks / Audit Logs
```

อีกมุมหนึ่ง:

```text id="5xsg5z"
Business
├── Products
├── Customers
├── Conversations
├── Messages
├── AI Memories
├── AI Actions
├── Tasks
└── Audit Logs
```

---

## 18. MVP Database Scope

MVP แรกควรสร้างตารางเหล่านี้ก่อน:

```text id="6w5e44"
users
businesses
business_members
customers
products
product_faqs
conversations
messages
ai_memories
ai_actions
approvals
tasks
audit_logs
```

ยังไม่ต้องสร้าง:

* accounting
* inventory movement
* shipping
* payment
* ads
* seo
* marketplace
* multi-branch
* supplier

เพราะ MVP ต้องโฟกัสที่ AI Customer Service Employee ก่อน

---

## 19. AI Query Context

เวลาลูกค้าถาม AI ต้องดึงข้อมูลประมาณนี้:

```text id="3a19k9"
business profile
customer profile
recent messages
related products
product FAQs
business rules
customer memories
conversation summary
```

ข้อมูลทั้งหมดนี้จะกลายเป็น Context ให้ AI สร้างคำตอบ

---

## 20. Data Safety

ฐานข้อมูลต้องป้องกันข้อมูลรั่วระหว่างธุรกิจ

กฎสำคัญ:

1. Query ส่วนใหญ่ต้องมี business_id
2. User ต้องเข้าถึงเฉพาะ business ที่เป็น member
3. AI ต้องเข้าถึงข้อมูลตาม permission เท่านั้น
4. Action สำคัญต้องมี Audit Log
5. ข้อมูลลูกค้าต้องไม่ถูกแชร์ข้าม Business
6. การลบข้อมูลสำคัญต้องระวังและควรใช้ soft delete

---

## 21. Future Expansion

ในอนาคตอาจเพิ่มตาราง:

```text id="j43ijv"
orders
order_items
inventory_movements
payments
shipments
promotions
campaigns
seo_articles
ad_accounts
suppliers
business_plugins
ai_agents
agent_tools
knowledge_documents
vector_embeddings
graph_relations
```

แต่ไม่ควรเพิ่มทั้งหมดตั้งแต่แรก

---

## 22. Final Principle

ฐานข้อมูลของ AURA ต้องไม่ใช่แค่ที่เก็บข้อมูล

ฐานข้อมูลต้องเป็นรากฐานของ Business Brain

ทุกข้อมูลที่เก็บต้องมีเป้าหมาย:

* ให้ AI เข้าใจธุรกิจมากขึ้น
* ให้ AI ตอบถูกขึ้น
* ให้ AI จำบริบทได้ดีขึ้น
* ให้ AI ลงมือทำงานได้ปลอดภัยขึ้น
* ให้ธุรกิจตัดสินใจจากข้อมูลจริงได้ดีขึ้น

Database ของ AURA คือ Memory Layer ของธุรกิจ
