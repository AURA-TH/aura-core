# Sprint DEV-001

Version: 0.1
Project: AURA Intelligence Platform
Sprint Name: Initial Project Structure
Owner: AURA Team
Developer Role: Claude as Lead Developer
Status: Ready for Claude

---

## 1. Sprint Goal

สร้างโครงสร้างโปรเจกต์เริ่มต้นของ AURA ให้พร้อมสำหรับการพัฒนา MVP

Sprint นี้ยังไม่เน้นสร้างฟีเจอร์เต็ม
เป้าหมายคือวางโครงสร้าง Codebase ให้ถูกต้องตั้งแต่วันแรก

AURA ต้องเริ่มจากโครงสร้างที่รองรับ:

* Web App
* Admin App
* API Server
* AI Brain
* Memory Engine
* Workflow Engine
* Action Engine
* Database Layer
* Shared Types
* UI Components

---

## 2. Important Context

AURA ไม่ใช่ SaaS ธรรมดา

AURA คือ AI-Native Business Brain

Product แรกคือ:

```text id="7cb83p"
AI Customer Service Employee
```

กลุ่มลูกค้าแรกคือ:

```text id="zyzxgk"
ร้านค้าออนไลน์
```

Pain แรกคือ:

```text id="7jmbpk"
ตอบลูกค้าไม่ทัน / ตอบลูกค้าไม่มีคุณภาพ / จ้างแอดมินแพง
```

Claude ต้องพัฒนาโดยยึดเอกสารทั้งหมดใน docs เป็นหลัก

---

## 3. Required Documents

ก่อนเริ่มเขียนโค้ด Claude ต้องอ่านเอกสารเหล่านี้:

```text id="jgupw6"
docs/00_foundation/AURA_Manifesto.md
docs/01_business/Business_Model.md
docs/02_product/Product_Bible.md
docs/03_architecture/Architecture_Overview.md
docs/03_architecture/Development_Standard.md
docs/03_architecture/Claude_Workflow.md
docs/04_ai/AI_Brain_Architecture.md
docs/04_ai/Business_Memory_Graph.md
docs/05_database/Database_Design.md
docs/06_api/API_Design.md
docs/07_roadmap/Roadmap_3_Years.md
```

Claude ต้องสรุปความเข้าใจก่อนเขียนโค้ด

---

## 4. Task Name

```text id="oi07e7"
Create Initial AURA Monorepo Structure
```

---

## 5. Scope

Claude ต้องสร้างโครงสร้างโปรเจกต์แบบ Monorepo

โครงสร้างที่ต้องสร้าง:

```text id="1qaem4"
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
│   ├── shared/
│   └── ui/
│
├── docs/
│   ├── 00_foundation/
│   ├── 01_business/
│   ├── 02_product/
│   ├── 03_architecture/
│   ├── 04_ai/
│   ├── 05_database/
│   ├── 06_api/
│   ├── 07_roadmap/
│   └── 08_meeting/
│
├── package.json
├── README.md
└── .gitignore
```

---

## 6. Tech Direction

ใช้แนวทางนี้:

```text id="l35gwj"
Frontend: Next.js + TypeScript
Backend: NestJS + TypeScript
Database: PostgreSQL
ORM: Prisma
Package Manager: pnpm
Architecture: Modular Monolith
```

---

## 7. What To Build in This Sprint

### 7.1 Root Setup

สร้างไฟล์พื้นฐาน:

```text id="bpjotw"
package.json
pnpm-workspace.yaml
.gitignore
README.md
```

### 7.2 Apps

สร้างโฟลเดอร์:

```text id="dg69bf"
apps/web
apps/admin
apps/api
```

### 7.3 Packages

สร้างโฟลเดอร์:

```text id="kxlgqf"
packages/brain
packages/memory
packages/workflow
packages/actions
packages/database
packages/shared
packages/ui
```

### 7.4 README

README ต้องอธิบายว่า:

* AURA คืออะไร
* Project Structure
* How to install
* How to run
* Development Rules
* MVP Scope

### 7.5 Placeholder Files

ในแต่ละ package ให้มี README.md เพื่ออธิบายหน้าที่ของ package นั้น

ตัวอย่าง:

```text id="182eg2"
packages/brain/README.md
packages/memory/README.md
packages/workflow/README.md
packages/actions/README.md
packages/database/README.md
packages/shared/README.md
packages/ui/README.md
```

---

## 8. Out of Scope

ห้ามทำสิ่งเหล่านี้ใน Sprint นี้:

```text id="zq0yiy"
ห้ามสร้าง POS
ห้ามสร้าง ERP
ห้ามสร้าง Payment
ห้ามสร้าง Shipping
ห้ามสร้าง Marketplace
ห้ามสร้าง Mobile App
ห้ามเชื่อม Facebook / LINE / Shopee / Lazada
ห้ามสร้าง AI Auto Reply จริง
ห้ามสร้างระบบ Billing
ห้ามเพิ่มฟีเจอร์ที่ไม่อยู่ในเอกสาร
```

Sprint นี้คือการสร้างโครงสร้าง ไม่ใช่การสร้างระบบเต็ม

---

## 9. Acceptance Criteria

Sprint นี้ถือว่าเสร็จเมื่อ:

```text id="fgklro"
1. Monorepo structure ถูกสร้างครบ
2. apps และ packages ถูกแยกชัดเจน
3. README หลักอธิบายโปรเจกต์ได้
4. README ของแต่ละ package อธิบายหน้าที่ได้
5. ใช้ pnpm workspace ได้
6. ไม่มีฟีเจอร์เกิน Scope
7. โครงสร้างสอดคล้องกับ Architecture_Overview.md
8. โครงสร้างสอดคล้องกับ Development_Standard.md
```

---

## 10. Claude First Response Requirement

ก่อน Claude จะเขียนโค้ด ต้องตอบก่อนว่า:

```text id="vqi366"
1. สรุปความเข้าใจของ AURA
2. สรุป MVP Scope
3. สรุป Architecture ที่จะใช้
4. รายการไฟล์และโฟลเดอร์ที่จะสร้าง
5. สิ่งที่จะไม่ทำใน Sprint นี้
6. ความเสี่ยงที่เห็น
7. แผนการลงมือทำ
```

หลังจากตอบแผนแล้ว จึงเริ่มเขียนโค้ดได้

---

## 11. Prompt To Send To Claude

ใช้ข้อความนี้ส่งให้ Claude:

```text id="suelmf"
You are the Lead Developer for AURA Intelligence Platform.

Your task is Sprint DEV-001: Create Initial AURA Monorepo Structure.

Before writing any code, read the relevant documentation in the docs folder.

AURA is not a normal SaaS app.
AURA is an AI-Native Business Brain.

The first product is AI Customer Service Employee for online stores.

Required docs to follow:
- AURA_Manifesto.md
- Business_Model.md
- Product_Bible.md
- Architecture_Overview.md
- Development_Standard.md
- Claude_Workflow.md
- AI_Brain_Architecture.md
- Business_Memory_Graph.md
- Database_Design.md
- API_Design.md
- Roadmap_3_Years.md

Sprint Scope:
Create the initial monorepo structure with:
- apps/web
- apps/admin
- apps/api
- packages/brain
- packages/memory
- packages/workflow
- packages/actions
- packages/database
- packages/shared
- packages/ui
- root package.json
- pnpm-workspace.yaml
- README.md
- .gitignore
- README.md files inside each package

Tech direction:
- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Package Manager: pnpm
- Architecture: Modular Monolith

Out of Scope:
Do not build POS, ERP, payment, shipping, marketplace, mobile app, external integrations, billing, or AI auto-reply yet.

Before coding, your first response must include:
1. Summary of your understanding
2. MVP scope
3. Architecture plan
4. Files and folders to create
5. What you will not do
6. Risks
7. Implementation plan

After that, create the project structure.
Follow Development_Standard.md strictly.
Do not add extra features.
```

---

## 12. Review Checklist

หลัง Claude ทำงานเสร็จ ต้องตรวจ:

```text id="sagv80"
1. โครงสร้างตรงตาม Sprint หรือไม่
2. มี apps/web, apps/admin, apps/api หรือไม่
3. มี packages ครบหรือไม่
4. มี pnpm-workspace.yaml หรือไม่
5. README อธิบายชัดหรือไม่
6. ไม่มีฟีเจอร์เกิน Scope หรือไม่
7. ไม่มีโค้ดมั่วหรือไฟล์ที่ไม่จำเป็นหรือไม่
8. สอดคล้องกับ Development_Standard.md หรือไม่
```

---

## 13. Final Note

Sprint DEV-001 คือจุดเริ่มต้นของ Codebase

ห้ามรีบสร้างฟีเจอร์ก่อนโครงสร้างชัด

AURA ต้องเริ่มจากโครงสร้างที่แข็งแรง เพื่อให้การพัฒนาระยะยาวไม่ต้องรื้อใหม่
