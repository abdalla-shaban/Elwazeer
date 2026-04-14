import { Headset, ShieldCheck, Truck, Verified } from "lucide-react";
import * as motion from "motion/react-client";

const features = [
  {
    icon: Truck,
    title: "شحن سريع وآمن",
    desc: "نصلك أينما كنت في أسرع وقت ممكن وبكل عناية",
    color: "bg-blue-500",
  },
  {
    icon: Verified,
    title: "جودة مضمونة 100%",
    desc: "جميع منتجاتنا أصلية وتخضع لأعلى معايير الجودة",
    color: "bg-primary",
  },
  {
    icon: Headset,
    title: "دعم فني متواصل",
    desc: "فريق متخصص للرد على استفسارتكم ومساعدتكم",
    color: "bg-secondary",
  },
];

const GlassFeatureSection = () => {
  return (
    <section className="container py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-4"
          >
            <div
              className={`size-16 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-3`}
            >
              <feature.icon className="size-8" />
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {feature.desc}
            </p>

            {/* Minimal line */}
            <div className="w-12 h-1 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-primary transition-all" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GlassFeatureSection;
