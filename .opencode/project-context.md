# SDQ — Project Context

> ملف مرجعي سريع لأي مطور أو مساعد ذكي (AI) يشتغل على المشروع ده. اقرأه الأول قبل أي تعديل.

---

## 1. المشروع ده إيه؟

المشروع عبارة عن **قالب Shopify (Shopify Theme)** مبني على القالب الرسمي **Horizon** (إصدار `3.5.1` من Shopify)، وتم تخصيصه لمتجر **SDQ / Sidq World**.

- **نوع المتجر:** براند ملابس رياضية / Streetwear.
- **السوق:** مصر (الأسعار بالجنيه المصري `EGP`، في نصوص عربية مكتوبة مباشرة داخل التمبليتس).
- **المحتوى:** تيشيرتات، بولو (Polo)، سويت بانتس (Sweatpants)، تانك توب (Tank tops)، ملابس رياضية (Sportwear)، بندلز (Bundles)، شورتس (Modest shorts)، خواتم (Rings).
- **بيانات التواصل في الفوتر:** تليفون `01055850588`، إيميل `sdqworldinfo@gmail.com`، العنوان `Ismailia 5Bloc C`.
- **السوشيال ميديا:** Facebook / Instagram (`@sidqwrld`) / TikTok (`@sidqwrld`).

> ملاحظة مهمة: ده **مش مشروع كود عادي** (مفيش `package.json` أو build step). هو قالب Liquid بيتم رفعه / معاينته عبر Shopify CLI أو من خلال الـ Theme Editor.

---

## 2. التقنية الأساسية (Tech Stack)

| المكوّن | التفاصيل |
| --- | --- |
| Templating | **Shopify Liquid** + JSON templates |
| Frontend | **Vanilla JS (ES Modules)** بدون framework |
| Styling | **CSS** عادي (متغيّرات CSS / Custom Properties) داخل `assets/base.css` |
| مكوّنات الواجهة | **Custom Web Components** (Custom Elements + Declarative Shadow DOM) |
| الأيقونات | ملفات **SVG** منفصلة داخل `assets/` |
| إدارة الوحدات | **Import Map** (`@theme/...`) معرّف في `snippets/scripts.liquid` |
| اللغات | 31 ملف locale، الافتراضي `en.default` (مفيش ملف `ar.json`، النصوص العربية inline في القوالب) |
| Type checking | `assets/jsconfig.json` + `assets/global.d.ts` (JSDoc + `checkJs`) |

### المعمارية باختصار
- كل صفحة بتتبني من **Sections** + **Blocks**، والـ JSON templates (`templates/*.json`) بتحدد ترتيب الأقسام والإعدادات.
- الجافاسكريبت معتمد على كلاس أساسي اسمه `Component` في `assets/component.js`:
  - بيدير `ref` attributes (زي `ref="cartDrawer"`) ويحفظهم في `this.refs`.
  - بيدعم **Declarative event listeners** عن طريق attributes زي `on:click="methodName"` بدل `addEventListener`.
  - بيدعم **Declarative Shadow DOM** و إعادة الهيدريشن بعد الـ Section Rendering API (`updatedCallback`).
- فيه **Section Rendering API** لتحديث أجزاء من الصفحة بدون reload (مثلاً السلة، الفلاتر، الـ Quick add) مع `section-renderer.js` و `section-hydration.js` و `morph.js`.
- فيه **View Transitions** (`view-transitions.js`) للتنقل الناعم بين الصفحات.

---

## 3. هيكل المجلدات (Directory Structure)

```
sdq/
├── .opencode/            ← ملفات إعداد/مرجع opencode (الملف ده)
├── assets/               ← JS + CSS + SVG + تعريفات الأنواع
│   ├── *.js              ← ~75 ملف ES module (كل feature في ملف)
│   ├── *.css             ← base.css (3510 سطر)، overflow-list.css، template-giftcard.css
│   ├── *.svg             ← أيقونات الواجهة
│   ├── global.d.ts       ← تعريفات Shopify / Theme / WebComponent
│   └── jsconfig.json     ← إعداد الـ type checking و path alias @theme/*
├── blocks/               ← Blocks قابلة للاستخدام جوه الأقسام (Theme blocks)
│   ├── *.liquid          ← blocks عامة (text, image, button, buy-buttons, variant-picker...)
│   ├── _*.liquid         ← blocks "static/dependent" خاصة بأقسام معيّنة
│   └── ai_gen_block_*.liquid ← blocks مولّدة بالذكاء الاصطناعي (تخصيصات SDQ)
├── config/
│   ├── settings_schema.json  ← تعريف إعدادات الثيم (2288 سطر)
│   └── settings_data.json    ← القيم الفعلية المحفوظة للمتجر
├── layout/
│   ├── theme.liquid      ← الـ layout الرئيسي (head, header-group, main, footer)
│   └── password.liquid   ← layout صفحة الباسورد
├── locales/              ← 31 لغة (en.default + schema files)
├── sections/             ← ~38 قسم (header, footer, hero, product-list, slideshow...)
├── snippets/             ← ~100 snippet (مكوّنات Liquid قابلة لإعادة الاستخدام)
└── templates/            ← 28 قالب JSON (index, product.*, collection.*, cart, blog...)
```

---

## 4. الملفات المهمة (Important Files)

| الملف | ليه مهم |
| --- | --- |
| `layout/theme.liquid` | نقطة البداية. بيحمّل `meta-tags`, `stylesheets`, `fonts`, `scripts`, `theme-styles-variables`, `color-schemes`، وبيعمل حساب ارتفاع الهيدر inline لمنع layout shift. |
| `snippets/scripts.liquid` | كل الـ JS + الـ import map + `modulepreload` + كائن `Theme` (routes + translations). أي سكربت جديد يتضاف هنا. |
| `snippets/stylesheets.liquid` | تحميل `overflow-list.css` و `base.css`. |
| `assets/component.js` | الكلاس الأساسي لكل الـ Web Components + نظام `on:event` + `refs`. |
| `assets/base.css` | كل الستايل العام + متغيّرات التصميم. |
| `config/settings_schema.json` | تعريف إعدادات الثيم العامة. |
| `config/settings_data.json` | القيم المحفوظة (الألوان، الخطوط، السلة، الأزرار...). |
| `sections/header-group.json` / `footer-group.json` | تجميع الهيدر/الفوتر (Section Groups). |
| `templates/index.json` | الصفحة الرئيسية وترتيب أقسامها. |

---

## 5. الأقسام (Sections) المتاحة

- **Layout:** `header`, `header-announcements`, `footer`, `footer-utilities`, `password`, `password-footer`, `section`, `_blocks`
- **Homepage / Marketing:** `hero`, `slideshow`, `layered-slideshow`, `marquee`, `logo`, `media-with-content`, `carousel`, `divider`, `custom-liquid`
- **Collections / Products:** `main-collection`, `main-collection-list`, `collection-list`, `collection-links`, `product-list`, `product-information`, `featured-product`, `featured-product-information`, `product-recommendations`, `product-hotspots`, `quick-order-list`, `section-rendering-product-card`
- **Content:** `main-blog`, `main-blog-post`, `featured-blog-posts`, `main-page`, `main-404`
- **Search / Cart:** `search-header`, `search-results`, `predictive-search`, `predictive-search-empty`, `main-cart`

---

## 6. القوالب (Templates) الموجودة

- **عامة:** `index`, `page`, `page.contact`, `cart`, `search`, `404`, `password`, `blog`, `article`, `list-collections`
- **Collections:** `collection`, `collection.tanks`, `collection.sport-bundels`, `collection.sports-bundelss`
- **Products (لكل منتج ليّه layout مخصّص):**
  `product`, `product.all-products-layout`, `product.black-tee`, `product.black-sweetpants`, `product.bundles`, `product.haq-navy`, `product.polo-navy`, `product.white-sabr-polo`, `product.ring`, `product.sports-t-shirts-tank`, `product.sports-bundels`, `product.sweet-pants`, `product.modest-short`

> كل قالب `product.*.json` ده layout مخصّص لمنتج معيّن (Shopify بيعمل template suffix)، فيبقى لكل منتج ترتيب blocks مختلف.

---

## 7. إعدادات المتجر الأساسية (من `settings_data.json`)

- **الهوية:** لوجو مرفوع `Untitled_design_4.png`.
- **الخطوط:** Body/Subheading = `Almarai`، Heading = `Assistant`، Accent = `Arial`.
- **عرض الصفحة:** `narrow`، حجم الفقرة 14px، H1 = 56px، H2 = 48px.
- **الأزرار:** `border-radius` = 14px.
- **السلة:** من نوع **Drawer** (درج جانبي)، مع دعم **Add discount code**، وبدون Cart note.
- **Quick Add:** مفعّل للديسكتوب والموبايل.
- **Header:** لوجو في الوسط، المنيو شمال، سيرش + اختيار البلد/اللغة يمين، Sticky header دايماً، ونمط المنيو `featured_products`.
- **Color schemes:** `scheme-1` (أبيض) … `scheme-6`، بالإضافة لـ schemes مخصّصة بالـ UUID (زي `scheme-58084d4c...` أسود للفوتر).

---

## 8. تطبيقات مدمجة (Shopify Apps)

ظاهرة في `settings_data.json` تحت `blocks`:

1. **Judge.me Reviews** — كروت مراجعات (`cards_carousel`) مستخدمة في الصفحة الرئيسية وصفحة الـ collection.
2. **Microsoft Clarity** — تحليلات (`clarity_js` + `brandAgents_js`).
3. **MP Size Chart** — مدمج لكنه **disabled**.

> أي block نوعه `shopify://apps/...` ده app block مِلك التطبيق ومش كود داخل القالب.

---

## 9. التخصيصات المضافة (Custom / AI-generated)

فيه blocks مولّدة بالذكاء الاصطناعي داخل `blocks/` (اسمها `ai_gen_block_*.liquid`)، وكلها متعلقة بصفحة المنتج:

- **Color Swatches** (`ai_gen_block_60b722c`, `ai_gen_block_e80fbbb`):
  دايرة ألوان قابلة للضغط، كل swatch ليّه اسم لون + hex + رابط منتج تاني، واللون النشط بيظهر محدّد.
- **Size Chart Accordion** (`ai_gen_block_97f14ac`, `ai_gen_block_b16130a`, `ai_gen_block_e2974dd`):
  أكورديون "Size chart" بيطلع صورة مقاس + جدول/ملاحظات، بستايل نضيف متوافق مع صفحة المنتج.

كل block فيهم بيستخدم `{% assign ai_gen_id = block.id | replace: '_', '' | downcase %}` عشان يعمل IDs/classes فريدة.

---

## 10. إرشادات التطوير (Conventions & Workflow)

### قواعد الكود
- **Liquid:** الأقسام بتستخدم `{% doc %}` في أول الملف لوصف الـ params/usage.
- **Snippets:** بتتندر بـ `{% render 'name', param: value %}`.
- **JS:**
  - ملف ES module مستقل لكل feature، ويتسجل في import map لو محتاج يتبعت بين الملفات (`@theme/...`).
  - أي Web Component يورّث من `Component` في `component.js`.
  - التعامل مع الأحداث بيتم عن طريق `on:click="..."` attributes، والوصول للعناصر عن طريق `ref` attributes.
  - كل JS لازم يعدّي الـ type checking (`checkJs: true`) باستخدام JSDoc.
- **الأيقونات:** تتضاف كـ SVG في `assets/` وتُستخدم عبر snippet `icon.liquid`.

### تشغيل/معاينة القالب
مفيش npm scripts. الطريقة المعتادة:

```bash
# رفع/مزامنة مع متجر التطوير
shopify theme dev
shopify theme push
shopify theme pull
```

> لو Shopify CLI مش متثبّت: `npm install -g @shopify/cli @shopify/theme`.

### قبل أي تسليم
- شغّل **Shopify Theme Check** للتأكد إن مفيش أخطاء في Liquid:
  ```bash
  shopify theme check
  ```
- راجع إن أي setting جديد متعرّف في `config/settings_schema.json` وليه default مناسب.

### حاجات تخلي بالك منها
- **متعدّلش** `config/settings_data.json` أو `locales/en.default.json` يدويًا إلا لو متأكد، لأنهم auto-generated من Shopify Admin وممكن يتكتبوا فوق بعض.
- الـ `.json` templates ملفات كبيرة ومتشابكة؛ عدّل بحرص ويفضّل من Theme Editor.
- النصوص العربية مكتوبة inline داخل الـ JSON templates، مش في ملفات locale.

---

## 11. ملخص سريع في سطرين

> قالب **Shopify Horizon 3.5.1** متخصّص لمتجر **SDQ** (ملابس رياضية/ستريت وير مصري)، معمارية **Liquid + Web Components + ES Modules**، مع تخصيصات AI لصفحة المنتج (Color Swatches + Size Chart)، وتطبيقات Judge.me و Microsoft Clarity مدمجة.
