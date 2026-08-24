# إعداد النشر التلقائي إلى Hostinger

تمت إضافة workflow في `.github/workflows/deploy-hostinger.yml`. يعمل تلقائيًا عند كل push إلى `main`، ويمكن تشغيله يدويًا من تبويب **Actions**.

## GitHub Secrets المطلوبة

من GitHub افتحي **Settings → Secrets and variables → Actions → New repository secret** وأضيفي القيم التالية:

| Secret | القيمة |
|---|---|
| `HOSTINGER_FTP_SERVER` | Host FTP من Hostinger، مثل `ftp.your-domain.com` أو القيمة الظاهرة في FTP Accounts |
| `HOSTINGER_FTP_USERNAME` | اسم مستخدم FTP من Hostinger |
| `HOSTINGER_FTP_PASSWORD` | كلمة مرور FTP |

الـ workflow يستخدم **FTPS على port 21**. إذا كانت Hostinger تعرض FTP Server مختلفًا، استخدمي القيمة التي تظهر في لوحة Hostinger بدل التخمين.

## مسار الرفع

الـ workflow يبني المشروع ثم يرفع محتويات `dist/public/`. تم ضبط `server-dir: ./` لأن حساب FTP في Hostinger يجب أن يكون مقيّدًا على مجلد الموقع `public_html`. إذا كان حساب FTP يبدأ من جذر الحساب وليس `public_html`، غيّري `server-dir` في workflow إلى `./public_html/`.

## التشغيل

بعد حفظ الـ Secrets، اعملي commit وpush إلى `main`. من GitHub افتحي **Actions → Deploy SAFETY ENG to Hostinger** وتابعي الخطوات. نجاح خطوتَي **TypeScript check** و**Build production files** ثم **Deploy to Hostinger via FTPS** يعني أن الرفع تم.

## ملاحظات مهمة

لا تضعي بيانات FTP داخل ملفات المشروع أو في `VITE_` variables. لا يحتاج `VITE_API_BASE_URL` إلى Secret لأنه عنوان API عام، وهو مضبوط حاليًا على `https://ecommerce.pixelmindg.com/api`. يجب أن يسمح الباك اند بـ CORS للدومين `safetyeng.pixelmindeg.com` وأن يعمل عبر HTTPS.

ملف `.htaccess` داخل `dist/public` ضروري لمسارات React مثل `/shop` و`/product/:id`. لا تحذفيه أثناء الرفع.
