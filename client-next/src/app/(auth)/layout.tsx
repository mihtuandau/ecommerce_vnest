import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black overflow-hidden p-4">
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/logoauth.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-100"
          sizes="100vw"
        />
        
        <div className="absolute inset-0 bg-slate-900/5"></div>
      </div>

      <div className="w-full max-w-[480px] bg-white/[0.03] backdrop-blur-[24px] border border-white/10 border-t-white/20 border-r-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out my-auto">
        {children}
      </div>
    </div>
  );
}
