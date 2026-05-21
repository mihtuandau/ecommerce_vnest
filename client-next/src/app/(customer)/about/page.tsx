import React from "react";
import { Target, Heart, Award, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            fill
            className="object-cover opacity-60 scale-105"
            alt="LUXE Hero"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-white text-xs font-semibold tracking-wider">
            <Sparkles className="w-4 h-4 text-primary" />
            Chào mừng đến với LUXE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Kiến tạo tương lai <br />
            mua sắm trực tuyến
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-normal leading-relaxed">
            Chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến trải nghiệm tinh tế,
            hiện đại và tin cậy tuyệt đối cho mọi khách hàng.
          </p>
        </div>
      </section>

      
      <section className="max-w-[1400px] mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-normal">
              <p>
                Ra đời từ năm 2024, LUXE bắt đầu với một ý tưởng đơn giản: Làm thế nào
                để việc mua sắm trực tuyến trở nên an toàn, nhanh chóng và tinh tế hơn?
              </p>
              <p>
                Chúng tôi hiểu rằng đằng sau mỗi đơn hàng là một niềm hy vọng, một món
                quà dành cho người thân, hay đơn giản là một phần thưởng cho bản thân.
                Vì thế, LUXE chăm chút từng chi tiết nhỏ nhất.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 pt-4">
              <div className="space-y-2 border-l-4 border-primary pl-6">
                <p className="text-4xl font-bold text-primary tracking-tighter">
                  50,000+
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Khách hàng tin dùng
                </p>
              </div>
              <div className="space-y-2 border-l-4 border-primary pl-6">
                <p className="text-4xl font-bold text-primary tracking-tighter">
                  1,000+
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Sản phẩm tuyển chọn
                </p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Our Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-slate-50/50 py-32 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Giá trị cốt lõi
            </h2>
            <p className="text-slate-500 font-medium">
              Ba trụ cột tạo nên sự khác biệt của LUXE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Tận tâm",
                desc: "Luôn đặt khách hàng làm trọng tâm trong mọi quyết định và hành động.",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Trung thực",
                desc: "Minh bạch trong mọi giao dịch và cam kết về nguồn gốc sản phẩm.",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Chất lượng",
                desc: "Tuyển chọn những sản phẩm tốt nhất với tiêu chuẩn khắt khe.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-12 bg-white rounded-[2.5rem] border border-slate-100 space-y-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
