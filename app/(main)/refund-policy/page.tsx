import SocialMediaIcons from "@/components/SocialMediaIcons";

export const metadata = {
  title: "سياسة الاسترداد والاستبدال",
  description:
    "سياسة الاسترداد والاستبدال لمتجر يارا ستور، توضح شروط المعاينة والاستبدال.",
};

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-10 min-h-screen bg-background px-4 py-12 md:px-8 lg:px-16 rounded-lg">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">سياسة الاسترداد والاستبدال</h1>
      </header>

      {/* Content */}
      <section className="space-y-4 text-sm leading-7">
        <p>
          في <strong>Elena Store (ايلينا ستور)</strong>  نحرص على رضا عملائنا وتقديم
          تجربة تسوق موثوقة وواضحة.
        </p>

        <p>
          نوفر <strong>معاينة للطلب عند الاستلام</strong>. في حال وجود أي مشكلة
          في الطلب أثناء التسليم، يمكنك رفض الطلب أو إرجاعه فورًا مع مندوب
          الشحن، مع تحمّل <strong>تكلفة الشحن فقط</strong>.
        </p>

        <p>
          بعد استلام الطلب، نوفر <strong>خدمة الاستبدال فقط</strong>، ولا يُسمح
          بالاسترجاع أو استرداد المبلغ.
        </p>
      </section>

      {/* Conditions */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">شروط الاستبدال</h2>
        <p>لضمان أهلية المنتج للاستبدال، يُشترط ما يلي:</p>
        <ul className="list-disc space-y-2 pr-6">
          <li>أن يكون المنتج في حالته الأصلية دون استخدام.</li>
          <li>أن يكون محتفظًا بالتغليف والبطاقات الأصلية.</li>
          <li>عدم وجود أي تلف أو تغيير في حالة المنتج.</li>
        </ul>
      </section>

      {/* Support */}
      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-xl font-semibold">التواصل معنا</h2>
        <p>
          إذا كان لديك أي استفسارات بخصوص سياسة الاستبدال أو طلبك، لا تتردد في
          التواصل مع فريق خدمة العملاء، وسنكون سعداء بمساعدتك.
        </p>
      </section>
      <SocialMediaIcons />
    </article>
  );
}
