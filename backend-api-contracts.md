# عقد Laravel المستخدم في SAFETY ENG

> هذا الملف توثيقي للفرونت فقط. ريبو Laravel تتم معاملته كقراءة فقط.

## المصادقة

| الطريقة | المسار | التوثيق | ملاحظات |
|---|---|---|---|
| POST | `/auth/login` | عام | يرسل البريد وكلمة المرور، والاستجابة تحتوي `data.access_token` أو `data.token` |
| POST | `/auth/register` | عام | إنشاء حساب، ثم تسجيل الدخول |
| POST | `/auth/logout` | Bearer Sanctum | إنهاء الجلسة |
| GET | `/user` | Bearer Sanctum | بيانات المستخدم الحالي |

## المفضلة

| الطريقة | المسار | التوثيق | الحقول |
|---|---|---|---|
| GET | `/favorites` | Bearer Sanctum | يعيد منتجات المفضلة داخل `data` |
| POST | `/favorites` | Bearer Sanctum | `{ product_id }`؛ Controller الحالي يضيف أو يزيل بالتبادل |
| DELETE | `/favorites/{id}` | Bearer Sanctum | `{id}` هنا هو `product_id` وليس favorite row id |

## السلة

| الطريقة | المسار | التوثيق | الحقول |
|---|---|---|---|
| GET | `/cart` | Bearer Sanctum | يعيد `id`, `product_variant_id`, `quantity`, وبيانات variant داخل `data` |
| POST | `/cart` | Bearer Sanctum | `{ product_variant_id, quantity }`، والـ variant مطلوب |
| DELETE | `/cart/{id}` | Bearer Sanctum | `{id}` هو معرف سطر السلة |
| GET | `/order-summary` | Bearer Sanctum | ملخص السلة الحالي |

## الطلبات

| الطريقة | المسار | التوثيق | ملاحظات |
|---|---|---|---|
| GET | `/orders` | Bearer Sanctum | يعيد طلبات المستخدم مع `items`، ويستخدم `status`, `subtotal`, `discount`, `shipping`, `total` |
| POST | `/orders` | Bearer Sanctum | Controller الحالي ينشئ الطلب من السلة الحالية؛ حقول الشحن ليست مستقبلة في النسخة التي تمت دراستها |

## خدمات التركيب والصيانة

لا يوجد مسار ظاهر لطلبات الخدمات في `routes/api.php` في النسخة المدروسة. سيستخدم الفرونت `VITE_SERVICE_ORDERS_PATH` اختياريًا لعرض سجل الخدمات إذا تم توفير endpoint من الباك اند، وإلا سيعرض حالة واضحة بأن سجل الخدمات يحتاج تفعيل API.

## قرارات التكامل

يجب إرسال Bearer token فقط عند وجود `safety-eng-token`. تبقى localStorage fallback للزائر أو عند فشل الشبكة، ولا تُعرض حالة fallback على أنها مزامنة ناجحة. لا يُرسل المنتج إلى `/cart` ما لم يتوفر `product_variant_id` من بيانات Laravel؛ المنتجات المحلية التي لا تملك variant تظل في السلة المحلية فقط.
