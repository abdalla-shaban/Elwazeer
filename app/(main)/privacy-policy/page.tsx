export const metadata = {
  title: "سياسة الخصوصية",
  description:
    "سياسة الخصوصية لمتجر يارا ستور توضح كيفية جمع واستخدام وحماية البيانات الشخصية.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-10 min-h-screen bg-background px-4 py-12 md:px-8 lg:px-16 rounded-lg">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">سياسة الخصوصية</h1>
        <p className="text-sm text-muted-foreground">
          آخر تحديث: 26 يوليو 2025
        </p>
      </header>

      {/* Introduction */}
      <section className="space-y-4 text-sm leading-7">
        <p>
          تُدير <strong>Wazeer Store (وزير العباية ستور)</strong> هذا المتجر
          والموقع الإلكتروني، بما في ذلك جميع المعلومات والمحتويات والميزات
          والأدوات والمنتجات والخدمات المرتبطة، بهدف توفير تجربة تسوق آمنة وسلسة
          لك كعميل (&quot;الخدمات&quot;).
        </p>
        <p>
          تم تطوير وتشغيل الموقع باستخدام تقنيات حديثة مثل{" "}
          <strong>Next.js</strong> و<strong>Node.js</strong> لتقديم خدماتنا بشكل
          مباشر دون الاعتماد على منصات تجارة إلكترونية خارجية.
        </p>
        <p>
          توضح سياسة الخصوصية هذه كيفية جمعنا لمعلوماتك الشخصية واستخدامها
          والإفصاح عنها عند زيارتك أو استخدامك لخدماتنا أو تواصلك معنا.
        </p>
      </section>

      {/* Personal Information */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">
          المعلومات الشخصية التي نجمعها أو نعالجها
        </h2>
        <p>
          نقصد بـ &quot;المعلومات الشخصية&quot; أي معلومات تُعرّفك أو يمكن ربطها
          بك بشكل معقول. لا تشمل المعلومات التي يتم جمعها بشكل مجهول أو بعد
          إزالة هويتها.
        </p>
        <ul className="list-disc space-y-2 pr-6">
          <li>
            تفاصيل الاتصال: الاسم، رقم الهاتف، البريد الإلكتروني، عنوان الشحن
            والفاتورة.
          </li>
          <li>
            المعلومات المالية: بيانات الدفع، تفاصيل المعاملات (يتم معالجتها عبر
            مزودي دفع آمنين).
          </li>
          <li>معلومات الحساب: اسم المستخدم، كلمة المرور، تفضيلاتك.</li>
          <li>
            معلومات المعاملات: المنتجات التي شاهدتها أو اشتريتها أو أضفتها إلى
            السلة.
          </li>
          <li>
            الاتصالات معنا: أي بيانات ترسلها عبر نماذج التواصل أو البريد
            الإلكتروني.
          </li>
          <li>معلومات الجهاز: عنوان IP، نوع الجهاز، المتصفح، نظام التشغيل.</li>
          <li>معلومات الاستخدام: كيفية تفاعلك مع الموقع والصفحات المختلفة.</li>
        </ul>
      </section>

      {/* Sources */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">مصادر المعلومات الشخصية</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>مباشرة منك عند إنشاء حساب أو إجراء طلب أو التواصل معنا.</li>
          <li>
            تلقائيًا من خلال استخدامك للموقع عبر تقنيات مثل ملفات تعريف الارتباط
            (Cookies).
          </li>
          <li>
            من مزودي الخدمات التقنية أو مزودي الدفع الذين يعملون نيابةً عنا.
          </li>
        </ul>
      </section>

      {/* Usage */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">كيف نستخدم معلوماتك الشخصية</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>معالجة الطلبات وتنفيذ عمليات الشحن.</li>
          <li>إدارة حسابك وتخصيص تجربتك داخل الموقع.</li>
          <li>تحسين أداء الموقع والخدمات.</li>
          <li>التواصل معك بخصوص الطلبات أو الدعم.</li>
          <li>إرسال إشعارات أو عروض تسويقية (عند موافقتك).</li>
          <li>منع الاحتيال وضمان أمان المعاملات.</li>
          <li>الامتثال للمتطلبات القانونية.</li>
        </ul>
      </section>

      {/* Disclosure */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">الإفصاح عن المعلومات الشخصية</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>
            مع مزودي الخدمات الضروريين لتشغيل الموقع (الدفع، الشحن، الاستضافة).
          </li>
          <li>عند الحصول على موافقتك الصريحة.</li>
          <li>للامتثال لالتزام قانوني أو أمر قضائي.</li>
          <li>في حالة اندماج أو بيع أو نقل ملكية الموقع أو جزء منه.</li>
        </ul>
      </section>

      {/* Third Party */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">روابط ومواقع الأطراف الثالثة</h2>
        <p>
          قد يحتوي موقع Wazeer Store على روابط لمواقع أو خدمات خارجية. لسنا
          مسؤولين عن ممارسات الخصوصية أو محتوى تلك المواقع، ويُنصح بمراجعة
          سياسات الخصوصية الخاصة بها.
        </p>
      </section>

      {/* Children */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">بيانات الأطفال</h2>
        <p>
          خدماتنا غير موجهة للأطفال دون السن القانوني، ولا نقوم بجمع معلوماتهم
          الشخصية عن قصد.
        </p>
      </section>

      {/* Security */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">الأمان والاحتفاظ بالمعلومات</h2>
        <p>
          نستخدم إجراءات أمنية وتقنية مناسبة لحماية معلوماتك، ومع ذلك لا يمكن
          ضمان الأمان الكامل بنسبة 100%. نحتفظ بالبيانات فقط للفترة اللازمة
          لتحقيق الأغراض الموضحة أو حسب ما يفرضه القانون.
        </p>
      </section>

      {/* Rights */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">حقوقك واختياراتك</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>الحق في الوصول إلى بياناتك الشخصية.</li>
          <li>طلب تصحيح أو تحديث معلوماتك.</li>
          <li>طلب حذف بياناتك (وفقًا للقانون).</li>
          <li>الاعتراض على معالجة بياناتك أو تقييدها.</li>
          <li>إدارة تفضيلات التواصل التسويقي.</li>
        </ul>
      </section>

      {/* Changes */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">التغييرات على سياسة الخصوصية</h2>
        <p>
          قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على
          هذه الصفحة مع تحديث تاريخ &quot;آخر تحديث&quot;.
        </p>
      </section>
    </article>
  );
}
