# رسالة جاهزة ليسرا — تكامل SAFETY ENG مع الـ API

يا يسرا، أنا بربط فرونت SAFETY ENG على الباك اند الموجود في ريبو E-Commerce. عنوان الـ API الحالي هو:

`https://ecommerce.pixelmindg.com/api`

## الـ endpoints التي سنستخدمها

| المجال | Method | Endpoint | المطلوب من الفرونت |
|---|---|---|---|
| Register | POST | `/auth/register` | `name`, `email`, `password`, `password_confirmation`, `phone` |
| Login | POST | `/auth/login` | `email` أو `phone` + `password`، وإرجاع `access_token` وبيانات المستخدم |
| Logout | POST | `/auth/logout` | Bearer token |
| Forgot password | POST | `/auth/forgot-password` | البريد الإلكتروني |
| Reset password | POST | `/auth/reset-password` | `email`, `password`, `password_confirmation`, `token` |
| Categories | GET | `/categories` | إرجاع `id`, `parent_id`, `parent_name`, `name`, `description`, `is_active` |
| Products | GET | `/products` | إرجاع قائمة المنتجات |
| Product details | GET | `/product/{id}` | إرجاع تفاصيل المنتج والصور والـ variants |
| Favorites | GET | `/favorites` | مفضلة المستخدم الحالي |
| Favorites toggle | POST | `/favorites` | `{ "product_id": number }` |
| Favorite remove | DELETE | `/favorites/{id}` | `{id}` يكون product id حسب الكود الحالي |
| Cart | GET | `/cart` | سلة المستخدم الحالية |
| Cart add | POST | `/cart` | `{ "product_variant_id": number, "quantity": number }` |
| Cart remove | DELETE | `/cart/{id}` | `{id}` يكون cart item id وليس product id |
| Order summary | GET | `/order-summary` | subtotal/discount/shipping/total |
| Create order | POST | `/orders` | إنشاء طلب من السلة الحالية |
| User orders | GET | `/orders` | الطلبات السابقة للمستخدم |
| Settings | GET | `/settings` | معلومات الشركة والسوشيال |
| FAQs | GET | `/faqs` | الأسئلة الشائعة النشطة |

## شكل الاستجابة المطلوب

يفضل توحيد كل الاستجابات بالشكل التالي:

```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```

وفي حالة الخطأ:

```json
{
  "status": "error",
  "message": "...",
  "errors": {}
}
```

## شكل المنتج المطلوب للفرونت

كل منتج نحتاج منه: `id`, `name`, `description`, `sku`, `price`, `compare_price`, `discount_percentage`, `is_active`, `category_id`, `category_name`, `category`, `images`, و`variants`.

حقلا `name` و`description` ممكن يكونا متعددَي اللغة مثل `{ "ar": "...", "en": "..." }`. الصور يفضل أن تحتوي على `url` كامل قابل للعرض من المتصفح. كل variant نحتاج منه `id`, `sku`, `price`, `stock`, `is_active`, `color`, و`size`.

## إصلاحات مطلوبة قبل اعتماد الربط النهائي

1. في `OrderController.php` يوجد خطأ syntax في السطر الذي يحتوي على `use App\\Models\\Cart;s`؛ حرف `s` بعد الفاصلة المنقوطة زائد.
2. `POST /orders` حاليًا لا يستقبل بيانات الشحن. نحتاج إضافة الحقول التالية: `name`, `phone`, `email` اختياري، `address`, `governorate`, `city`, `notes`, و`payment_method`.
3. نحتاج معرفة شكل استجابة `/cart` وهل عنصر السلة يحتوي `cart_item_id`, `product_variant_id`, `quantity`, `unit_price`, وبيانات المنتج.
4. نحتاج تأكيد هل `DELETE /favorites/{id}` يستخدم product id أم favorite record id؛ الأفضل توحيده وتوثيقه.
5. لو أسماء التصنيفات في قاعدة البيانات مختلفة عن واجهة المتجر، نحتاج `slug` ثابت لكل تصنيف، مثل `security-cameras`, `attendance`, `office`, `pos`, `printers`.
6. لا يوجد حاليًا API لطلبات تركيب وصيانة أو رفع صور المكان وتحديد الموقع. إذا أردنا حفظها داخل النظام نحتاج `POST /service-requests` بصيغة `multipart/form-data` وبحقول `name`, `phone`, `service_type`, `details`, `location_url`, و`photos[]`.
7. يجب التأكد من CORS للسماح بدومين الفرونت المنشور، مع دعم `Authorization: Bearer <token>` و`Accept: application/json`.
8. يفضل إضافة pagination وفلاتر اختيارية إلى `/products`: `search`, `category_id`, `min_price`, `max_price`, `sort`, و`page`.

## المطلوب منك

ابعتيلي تأكيدًا على شكل الـ response النهائي لكل endpoint، خصوصًا `/products`, `/product/{id}`, `/favorites`, `/cart`, `/order-summary`, و`/orders`، وبعد إصلاح النقاط السابقة أقدر أستبدل fallback المحلي بالربط الكامل في كل شاشات الفرونت.

مهم: أنا لم أعدل أي ملف في ريبو الباك اند، وكل التعديلات الحالية موجودة في ريبو الفرونت فقط.
