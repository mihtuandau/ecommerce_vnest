import { Clock, Mail, Phone, Wrench } from "lucide-react";

type MaintenanceShieldSettings = {
  storeName?: string;
  storePhone?: string;
  storeEmail?: string;
  maintenanceMessage?: string;
};

interface MaintenanceShieldProps {
  settings?: MaintenanceShieldSettings | null;
}

export function MaintenanceShield({ settings }: MaintenanceShieldProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-[#FAF8F4] p-6 font-sans-brand text-[#3D2B1A]">
      <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C4783A]/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A7966]/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-in space-y-8 text-center duration-700 fade-in zoom-in-95">
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-[#3D2B1A]">
            {settings?.storeName || "LUXE E-Commerce"}
          </h2>
          <div className="mx-auto h-px w-12 rounded-full bg-[#C4783A]/40" />
        </div>

        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-[#DDD6C8] bg-white shadow-xs">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#C4783A]/5 to-[#8A7966]/5" />
          <Wrench className="h-9 w-9 animate-bounce text-[#C4783A] duration-1000" />
        </div>

        <div className="space-y-3 px-2">
          <h1 className="text-[22px] font-bold tracking-tight text-[#3D2B1A]">
            Hệ thống đang bảo trì
          </h1>
          <p className="text-[13.5px] font-medium leading-relaxed text-[#8A7966]">
            {settings?.maintenanceMessage ||
              "Chúng tôi đang bảo dưỡng hệ thống để mang lại trải nghiệm mua sắm tốt hơn cho quý khách."}
          </p>
        </div>

        <div className="mx-auto flex max-w-sm items-center gap-3.5 rounded-2xl border border-[#EFEBE4] bg-[#F9F6F0] p-4 text-left shadow-2xs">
          <Clock className="h-5 w-5 shrink-0 text-[#C4783A]" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#3D2B1A]">
              Thời gian dự kiến hoàn thành
            </p>
            <p className="text-[11px] font-semibold leading-relaxed text-[#8A7966]">
              Thường mất khoảng 1 - 2 tiếng. Xin trân trọng cảm ơn sự kiên nhẫn
              của quý khách hàng!
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-sm space-y-3.5 border-t border-[#DDD6C8] pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7966]">
            Hỗ trợ trực tuyến
          </p>
          <div className="flex flex-col justify-center gap-4 text-xs font-semibold text-[#3D2B1A] sm:flex-row">
            {settings?.storePhone && (
              <a
                href={`tel:${settings.storePhone}`}
                className="flex items-center justify-center gap-2 text-[#3D2B1A] transition-colors hover:text-[#C4783A]"
              >
                <Phone className="h-3.5 w-3.5 text-[#C4783A]" />
                {settings.storePhone}
              </a>
            )}
            {settings?.storeEmail && (
              <a
                href={`mailto:${settings.storeEmail}`}
                className="flex items-center justify-center gap-2 text-[#3D2B1A] transition-colors hover:text-[#C4783A]"
              >
                <Mail className="h-3.5 w-3.5 text-[#C4783A]" />
                {settings.storeEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
