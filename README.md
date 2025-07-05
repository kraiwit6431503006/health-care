# Health Care Project

---

## Problem Statement

"สมมติว่าบริษัทต้องพัมนาเว็บแอปพลิคชันด้านสาธราณสุขซึ่งมี 2 บทบาทผู้ใช้
1. Data Collector - เจ้าหน้าลงพื้นที่บันทึกข้อมูลประชาชน
2. Data Analyst - เจ้าหน้าที่วิเคราะห์และผู้บริหารต้องใช้ข้อมูลภาพรวมในการตัดสินใจ
แอปต้องสนับสนุนการทำงานของทั้งสองทบาทอย่างปลอดภัย พร้อมควบคุมสิทธิการเข้าถึงข้อมูล"

---

## Requirement

- ระบบล๊อคอินนและจัดการสิทธิ์การใช้งาน
- แบบฟอร์มบันทึกข้อมูลสุขภาพ ของประชาชนในเขตพื้นที่
- แสดงผลข้อมูลในรูปแบบ ตาราง และ กราฟสถิติ
- Export รายงาน ออกเป็นไฟล์ PDF/CSV

---

## Tech Stack

- Framework : Vue.js
(เหตุผล : มีประสบการ์ณการใช้งาน Vue มา 3-4 ปี ตั้งแต่ตอนเรียนอยู่ครับ)
- Styling : Tailwind CSS 
(เหตุผล : เคยเรียนรู้ tailwind อยู่ช่วงหนึ่งครับ ปกติผมใช้ ui component ตลอดครับ และเห็นว่าเป็นที่นิยมในการใช้งานร่วมกับ vue ผมเลยเลือกมาใช้เพื่อที่จะเรียนรู้ครับ)
- Backend API : Json sever
(เหตุผล : เห็นมีแนะนำครับ พอได้ใช้แล้วรู้สึกว่าน่าสนใจและสะดวกสบายในการทำ frontend มากครับ) 

---

## Getting Started

### 1.Install Pnpm

```bash
npm install -g pnpm
```

### 2.Vertify version pnpm

```bash
pnpm -v
```

### 3.Install dependencies

```bash
pnpm i
```

### 4.Run json sever

Run json sever

```bash
pnpm run api
```

### 5.Run Project
```bash
pnpm dev
```
