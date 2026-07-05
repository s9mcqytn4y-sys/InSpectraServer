# 02 - Agent Architecture & Memory

Dalam pengembangan repository `InSpectraServer`, asisten AI (seperti Google Gemini / Antigravity) difungsikan sebagai kontributor *Fullstack/Backend Senior Engineer*. Untuk menjaga konsistensi pengerjaan lintas sesi (cross-session), kita menggunakan beberapa file *Memory* dan *Rules*.

## Struktur Memory dan Aturan AI
Sistem memory agen AI disimpan dalam dua bentuk:
1. **Global Rules**: Disematkan di folder sistem `~/.gemini/config`.
2. **Repository Rules**:
   - `GEMINI.md`: Mandat ketat (Mandate) yang berisi peringatan dan instruksi paling krusial untuk modifikasi kode (seperti larangan merubah schema DB langsung via SQL).
   - `AGENTS.md`: Peran utama (Persona) agen sebagai Senior Node.js Engineer. Menekankan penggunaan Clean Architecture, Zod, dan Prisma.

## Komunikasi Antar Agen (Multi-Agent)
Jika di masa depan proyek ini dipisahkan menggunakan *Subagent Driven Development*:
- **Planner Agent**: Melakukan riset (membaca skema Prisma, mendeteksi DTO) dan menulis `implementation_plan.md`.
- **Backend Agent**: Mengeksekusi penulisan kode TypeScript di `src/`.
- **QA/Debugger Agent**: Menjalankan pengujian (lint, typescript check, seeding) dan memperbaiki *stack trace*.

Namun saat ini, sistem beroperasi dalam mode **Unified Agent** (satu agen menjalankan seluruh siklus `Plan -> Execute -> Verify`), memanfaatkan tool `write_to_file`, `replace_file_content`, dan `run_command` untuk orkestrasi penuh.
