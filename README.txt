TARIX OLAMI — NETLIFY + USTOZ FAOLLIK JURNALI

ZIP ICHIDAGI FAYLLAR:
- index.html, style.css, data.js, script.js — sayt
- functions/grade.js — AI baholash funksiyasi
- functions/activity.js — kirish/chiqish va harakatlarni yozib borish
- functions/teacher-auth.js — ustoz parolini serverda tekshirish va himoyalangan sessiya
- netlify.toml — Netlify sozlamalari
- package.json — Netlify Blobs kutubxonasi

NETLIFY'GA TO‘G‘RI JOYLASH:
1. ZIP faylni kompyuterga yuklab oling va Extract All / Извлечь все qiling.
2. Papkani GitHub orqali Netlify'ga ulang (tavsiya qilinadi), yoki Netlify Drop orqali joylang. Deploy qilingan papkaning ichida netlify.toml, package.json va functions/ papkasi bo‘lishi shart.
3. Netlify'da Site configuration / Site settings -> Environment variables bo‘limini oching.
4. TEACHER_PASSWORD nomli o‘zgaruvchi yarating va kuchli parol belgilang. Xavfsizlik uchun standart parol o‘rniga o‘zingizning kuchli parolingizni belgilang. Agar eski parolni saqlamoqchi bo‘lsangiz: Ustoz2026!.
5. TEACHER_SESSION_SECRET nomli yana bir o‘zgaruvchi yarating; unga uzun, tasodifiy maxfiy qiymat yozing (kamida 32 ta belgi).
6. Agar AI baholash kerak bo‘lsa, OPENAI_API_KEY nomli o‘zgaruvchi qo‘shing. API kalitni faqat shu yerga kiriting, JavaScript fayliga yozmang.
7. Deploys -> Trigger deploy -> Deploy site qiling. Deploy logda functions va package install xatosi yo‘qligini tekshiring.
8. Saytga ustoz sifatida TEACHER_PASSWORD qiymati bilan kiring, so‘ng “Kirishlar va harakatlar” tugmasini bosing.

USTOZNING FAOLLIK JURNALI:
- Hisobga kirish va chiqish tugmasi bosilishi;
- saqlangan sessiya qayta ochilishi;
- qaysi mavzu ochilgani;
- test boshlangani, savol raqami va tanlangan javob;
- test topshirilgani, balli va sarflangan vaqti;
- faol sahifa ochiq turganida taxminan har 30 soniyada faollik signali;
- jurnalni CSV fayl qilib yuklab olish.

VAQT VA ANIQLIK HAQIDA:
- Server har bir qaydga o‘z vaqt tamg‘asini qo‘yadi; ustoz oynasida O‘zbekiston vaqti bilan ko‘rsatiladi.
- O‘quvchi “Hisobdan chiqish” tugmasini bosmasa, brauzer yopilsa yoki internet uzilsa, sayt aniq chiqish vaqtini bilolmaydi. Bunday vaziyatda oxirgi faollik signali ko‘rinadi; bu chiqishning aniq vaqti emas.
- Bu jurnal brauzer/foydalanuvchi yuborgan harakatlarni qayd etadi. To‘liq himoyalangan, shaxsni ishonchli tasdiqlaydigan tizim uchun server tomonidagi autentifikatsiya (masalan, Supabase/Firebase) ham kerak. Hozirgi saytning login tizimi hali ham localStorage asosida; uni xavfsiz ko‘p foydalanuvchili hisob tizimi deb hisoblamang.
- Jurnal Netlify Blobs orqali serverda saqlanadi, shuning uchun turli qurilmalardan yuborilgan qaydlar bir joyga to‘planadi. Internet yoki funksiya ishlamasa, qayd yozilmay qolishi mumkin.

USTOZ HISOBI (standart):
Login: Jo‘rayev Murodillo
Parol: Ustoz2026!
Xavfsizlik uchun TEACHER_PASSWORD ni Netlify'da o‘zingiz belgilagan parolga moslang. Agar sayt ichida ustoz paroli o‘zgartirilsa, Environment variables dagi TEACHER_PASSWORD ni ham shu parolga yangilang.

MUHIM:
- Netlify Drop va functions/dependencies qo‘llab-quvvatlashi deploy usuliga qarab farq qilishi mumkin. Agar funksiyalar deploy qilinmasa, GitHub repository orqali Netlify'ga ulash tavsiya etiladi.

USTOZ KABINETI XAVFSIZLIGI:
- Ustoz paroli serverless funksiya orqali tekshiriladi; muvaffaqiyatli kirishda 8 soatlik HttpOnly sessiya cookie beriladi.
- Jurnalni o‘qish uchun ushbu sessiya talab qilinadi.
