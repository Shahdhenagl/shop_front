# SAFETY ENG — Backend API Integration Notes

هذه الوثيقة تلخص دراسة ريبو [yosra200/E-Commerce](https://github.com/yosra200/E-Commerce) بهدف تجهيز فرونت SAFETY ENG للتكامل معه. تم التعامل مع الريبو كنسخة قراءة فقط، ولم يتم تعديل أي ملف أو رفع أي commit إليه.

## الحالة العامة

الباك اند مبني على Laravel 12 ويستخدم Laravel Sanctum للتوثيق. الاستجابات الناجحة تأتي بالشكل العام التالي:

```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```

أما الخطأ فيأتي غالبًا بالشكل التالي:

```json
{
  "status": "error",
  "message": "..."
}
```

يجب أن يقرأ عميل الفرونت `data` للبيانات، وأن يعرض `message` للمستخدم عند النجاح أو الخطأ.

## Endpoints المتاحة

| المجال | الطريقة والمسار | التوثيق | الاستخدام في الفرونت |
|---|---|---|---|
| Auth | `POST /api/auth/register` | لا يوجد | إنشاء حساب بالاسم والبريد والهاتف وكلمة المرور وتأكيدها |
| Auth | `POST /api/auth/login` | لا يوجد | تسجيل الدخول بالبريد أو الهاتف، ويعيد `access_token` وبيانات المستخدم |
| Auth | `POST /api/auth/logout` | Bearer Sanctum | حذف التوكن الحالي |
| Auth | `POST /api/auth/forgot-password` | لا يوجد | إرسال رابط إعادة كلمة المرور بالبريد |
| Auth | `POST /api/auth/reset-password` | لا يوجد | إعادة كلمة المرور باستخدام email/password/password_confirmation/token |
| Catalog | `GET /api/categories` | لا يوجد | تحميل التصنيفات |
| Catalog | `GET /api/products` | لا يوجد | تحميل كل المنتجات |
| Catalog | `GET /api/product/{id}` | لا يوجد | تفاصيل منتج واحد |
| Content | `GET /api/settings` | لا يوجد | about_us وprivacy_policy وsocial_media |
| Content | `GET /api/faqs` | لا يوجد | الأسئلة الشائعة النشطة |
| Favorites | `GET /api/favorites` | Bearer Sanctum | مفضلة المستخدم |
| Favorites | `POST /api/favorites` | Bearer Sanctum | إضافة أو إزالة favorite حسب product_id؛ endpoint يعمل toggle |
| Favorites | `DELETE /api/favorites/{id}` | Bearer Sanctum | إزالة منتج من المفضلة باستخدام product id |
| Cart | `GET /api/cart` | Bearer Sanctum | قراءة سلة المستخدم |
| Cart | `POST /api/cart` | Bearer Sanctum | إضافة variant باستخدام product_variant_id وquantity |
| Cart | `DELETE /api/cart/{id}` | Bearer Sanctum | حذف عنصر السلة باستخدام cart item id وليس product id |
| Checkout | `GET /api/order-summary` | Bearer Sanctum | حساب subtotal/discount/shipping/total |
| Checkout | `POST /api/orders` | Bearer Sanctum | إنشاء الطلب من السلة الحالية ثم تفريغها |
| Orders | `GET /api/orders` | Bearer Sanctum | قراءة طلبات المستخدم السابقة |

## شكل المنتج

`GET /api/products` و`GET /api/product/{id}` يعيدان Resource للمنتج يحتوي على `id`, `name`, `description`, `sku`, `price`, `compare_price`, `discount_percentage`, `is_active`, `category_id`, `category_name`, `category`, `images`, و`variants`.

حقلا `name` و`description` متعددَا اللغة، أي أنهما JSON object وليس نصًا مباشرًا. في الفرونت يجب استخدام helper مثل `value?.ar ?? value?.en ?? value` قبل العرض.

صور المنتجات تأتي داخل `images`، وكل صورة تحتوي على `image` كمسار خام و`url` كرابط مبني من `asset('storage/...')`. يفضل الفرونت استخدام `url` أولًا مع fallback إلى `image` إذا كان السيرفر يعيد مسارًا صالحًا.

كل variant يحتوي على `id`, `sku`, `price`, `stock`, `is_active`, و`color` و`size`. إضافة المنتج إلى السلة تحتاج **variant id** وليس product id؛ لذلك صفحة التفاصيل يجب أن تختار variant صالحًا قبل تفعيل زر الإضافة.

## المصادقة

بعد `POST /api/auth/login` يجب حفظ `data.access_token` وإرسال الطلبات المحمية بالهيدر التالي:

```http
Authorization: Bearer <access_token>
Accept: application/json
```

التسجيل لا يعيد token بحسب الكود الحالي؛ لذلك تدفق الفرونت المقترح هو التسجيل ثم تحويل المستخدم إلى تسجيل الدخول، أو مطالبة المستخدم بتسجيل الدخول بعد نجاح التسجيل.

## نماذج الإدخال

### Register

```json
{
  "name": "اسم العميل",
  "email": "customer@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "01000000000"
}
```

### Login

يجب إرسال `email` أو `phone` واحدًا على الأقل مع `password`:

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

### Favorite

```json
{ "product_id": 12 }
```

### Cart

```json
{
  "product_variant_id": 34,
  "quantity": 2
}
```

## ملاحظات مهمة قبل بدء الربط

هناك نقطة تمنع تشغيل الباك اند كما هو حاليًا: `OrderController.php` يحتوي على `use App\\Models\\Cart;s`، أي حرف `s` زائد بعد الفاصلة المنقوطة، وهذا يحتاج إصلاحًا من يسرا في ريبو الباك اند قبل تجربة checkout.

كذلك `ProductController@index` لا يستقبل فلاتر أو pagination؛ الفرونت يمكنه تنفيذ البحث والتصنيف والترتيب محليًا مؤقتًا، لكن عند زيادة عدد المنتجات يفضل إضافة query parameters مثل `category_id`, `search`, `min_price`, `max_price`, `sort`, و`page` من جهة الباك اند.

مورد التصنيفات يعيد `id`, `parent_id`, `parent_name`, `name`, `description`, و`is_active` فقط، ولا يعيد `slug` أو `image` أو `sort_order` رغم وجود بعض هذه الحقول في قاعدة البيانات. يجب ألا يعتمد الفرونت عليها قبل تعديل المورد من جهة الباك اند.

نموذج `orders` الحالي ينشئ الطلب من السلة المحفوظة للمستخدم ولا يستقبل بيانات الشحن من request. لذلك صفحة Checkout الحالية في الفرونت لن تستطيع إرسال الاسم والعنوان والمحافظة ورقم الهاتف إلى order API حتى تتم إضافة هذه الحقول إلى الباك اند.

لا يوجد endpoint في الريبو الحالي لطلبات تركيب وصيانة أو لرفع صور المكان والموقع. نموذج الخدمة في الفرونت يمكن أن يستمر مؤقتًا عبر WhatsApp، أو تحتاج يسرا إلى إضافة ServiceRequest endpoint ورفع ملفات إذا كان المطلوب تخزين الطلبات داخل النظام.

## خطة الربط المقترحة للفرونت

في المرحلة الأولى، يتم إنشاء طبقة API client واحدة تقرأ `VITE_API_BASE_URL`، وتضيف `Accept` وBearer token تلقائيًا، وتوحّد قراءة `status/data/message`. بعدها يتم استبدال بيانات المنتجات المحلية باستدعاء `/api/products` مع normalizer للحقول متعددة اللغة والصور والمتغيرات.

في المرحلة الثانية، يتم تفعيل الحساب والمفضلة والسلة بعد التأكد من إصلاح خطأ `Cart;s` وتحديد variant افتراضي أو واجهة اختيار variant. في المرحلة الثالثة، يتم ربط Checkout بـ `/api/order-summary` و`POST /api/orders` بعد أن تضيف يسرا حقول الشحن المطلوبة إلى الطلب.

> لم يتم تعديل ريبو الباك اند أو تشغيل migrations أو إرسال أي request تغييري عليه. النسخة المستنسخة موجودة محليًا للدراسة فقط، وحالتها كانت نظيفة عند الفحص.

## References

[1]: https://github.com/yosra200/E-Commerce "E-Commerce Laravel backend repository"
[2]: https://laravel.com/docs/12.x/sanctum "Laravel Sanctum documentation"
