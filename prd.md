Product Requirements Document (PRD)

Produk: Remind Me
Tipe: Aplikasi Pengingat Berbasis Web
Stack: Angular (Frontend), Go/Node (opsional untuk backend), PostgreSQL, Scheduler/Worker Cron
Tujuan: Mengelola data kontrak/software/masa berlaku dan memberikan reminder otomatis berdasarkan tanggal jatuh tempo. Import massal dari Excel.

1. Latar Belakang

Perusahaan sering memiliki kontrak, lisensi software, layanan cloud, dan dokumen lain yang memiliki masa berlaku. Tanpa sistem reminder, risiko terlambat memperpanjang tinggi. Remind Me menyediakan sistem sederhana untuk menyimpan deadline dan mengirimkan notifikasi otomatis sesuai jadwal yang ditentukan.

2. Sasaran Produk

Mencegah keterlambatan renewal kontrak/software.

Menyediakan reminder otomatis dan manual schedule-based.

Mendukung input manual dan bulk import via Excel terformat.

Fleksibel dalam opsi reminder (custom interval).

3. Target Pengguna

Administrator internal / IT Support.

Procurement / Finance.

Individu yang ingin memantau masa expired dokumen.

4. Scope Fitur
4.1 Core Feature
Fitur	Deskripsi
CRUD Reminder Item	Title, Description opsional, Due Date, Category, Status (active/non-active).
Multi Notification Schedule	Dapat memilih reminder: H-1, H-3, H-7, H-30, atau custom (input angka hari).
Excel Import	Format Excel: title, due_date, description(optional), reminder_days_before(optional array comma-separated).
Notification System	Notifikasi email/ WA webhook/ UI toast (versi 1 default email).
Background Scheduler	Cron job membaca item yang due & trigger notifikasi.
Dashboard	List reminder, sorting by nearest due, filter overdue, filter month.
Log Notifikasi	Menyimpan kapan reminder dikirim, status sent/failed.
4.2 Nice To Have (fase berikutnya)

Attachment dokumen.

Integrasi WhatsApp API.

Multi user + permission.

Calendar view mode.

Integrasi Google Calendar.

5. Requirement Teknis
5.1 Database (PostgreSQL)

Tabel utama reminders:

id (uuid PK)
title (varchar)
description (text)
due_date (date)
reminder_days_before (int[] default {1,7,30})
status (enum: active, completed, cancelled)
created_at, updated_at (timestamp)


Tabel log reminder_logs:

id
reminder_id
sent_at timestamp
status enum(sent,failed)
message text

5.2 API Endpoint Minimal
Endpoint	Method	Deskripsi
/api/reminders	POST	tambah reminder
/api/reminders/import-excel	POST multipart	bulk import file
/api/reminders	GET	list + filter query (due soon, overdue)
/api/reminders/{id}	PUT	update
/api/reminders/{id}	DELETE	hapus
/api/notify/test	POST	kirim notifikasi dummy
5.3 Scheduler

Worker terpisah atau cron dalam backend.
Logic:

Harian jam 08:00 server → scan reminders.

Jika due_date - today = reminder_days_before, buat event notifikasi.

Kirim email & simpan log.

6. UI/UX Requirement
Dashboard List

Table: Title | Due Date | Reminder Setting | Status | Next Notification | Actions

Highlight warna merah jika overdue.

Sort by nearest due date desc.

Search by title.

Form Add Reminder

Input: Title, Description (optional)

Due date (date picker)

Notification setting:

 H-1

 H-3

 H-7

 H-30

Custom input number (multiple allowed)

Excel Upload

Instruksi format sample:

title | due_date | description | reminder_days_before
Domain Renewal | 2025-02-10 | Renewal yearly | 1,7,30


Import validation:

Format salah → tampilkan jumlah error & row.

Success → tampil summary imported & duplicate handling opsi skip/replace.

7. Business Rules

Reminder hanya dikirim jika status ACTIVE.

Completed → tidak trigger lagi.

Sistem tidak kirim dua kali untuk hari yang sama.

Notifikasi dikirim pada jam terjadwal.

8. KPI Keberhasilan

Mengurangi keterlambatan renewal <5%.

95% reminder terkirim tepat waktu.

Import massal min 1000 row tanpa fail.