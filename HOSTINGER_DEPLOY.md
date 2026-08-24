# نشر SAFETY ENG على Hostinger من GitHub

## إعدادات Hostinger

في Hostinger افتحي **Websites → Add Website → Import from GitHub**، اختاري مستودع `Shahdhenagl/shop_front`، ثم استخدمي الإعدادات التالية إذا كان حسابك يدعم نشر Node/Build:

| الحقل | القيمة |
|---|---|
| Branch | `main` أو الفرع الذي يحتوي آخر نسخة |
| Install command | `pnpm install --frozen-lockfile` أو `npm install` |
| Build command | `pnpm build` |
| Publish directory | `dist/public` |
| Environment variable | `VITE_API_BASE_URL=https://ecommerce.pixelmindg.com/api` |

إذا كان نوع الاستضافة **Static/Shared Hosting** ولا يشغل Node، نفّذي `pnpm build` محليًا ثم ارفعي محتويات `dist/public` إلى مجلد `public_html`، وليس مجلد `dist` نفسه.

## مهم لمسارات React

ملف `client/public/.htaccess` موجود داخل المشروع، وسيتم نسخه إلى `dist/public` أثناء البناء. ارفعيه مع `index.html` حتى تعمل مسارات `/shop` و`/product/:id` بعد عمل refresh.

## متطلبات الـ API

يجب أن يكون عنوان الباك اند متاحًا عبر HTTPS، وأن يسمح CORS بدومين Hostinger. يجب السماح بالـ headers `Accept`, `Content-Type`, و`Authorization`، مع دعم `Authorization: Bearer <token>` للواجهات المحمية.

## ملاحظة عن Vite

متغيرات Vite التي تصل للمتصفح يجب أن تبدأ بـ `VITE_`. بعد تغيير `VITE_API_BASE_URL` يجب عمل build جديد؛ تعديل المتغير في السيرفر بعد رفع ملفات build لا يغيّر القيمة الموجودة داخل JavaScript المبني مسبقًا.

## فحص سريع بعد النشر

افتحي الصفحة الرئيسية، ثم `/shop`، ثم افتحي منتجًا واعملي refresh. جربي البحث على الموبايل، تبديل Dark Mode، إضافة منتج مع خدمة تركيب، الانتقال إلى Checkout، ثم راقبي Network للتأكد أن الطلبات تذهب إلى `https://ecommerce.pixelmindg.com/api`.
