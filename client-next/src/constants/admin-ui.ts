export const adminUI = {
  layout: {
    pagePadding: "px-6 py-6",
    sectionGap: "gap-6",
  },
  card: {
    base: "bg-white rounded-2xl border border-slate-200 shadow-sm",
    padding: "p-6",
  },
  form: {
    label: "block text-sm font-semibold text-slate-700 mb-2",
    input:
      "h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
    helper: "text-xs text-slate-500 mt-1",
  },
  button: {
    base: "inline-flex items-center justify-center rounded-xl h-10 px-4 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
      "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-sm",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  },
  table: {
    wrapper: "w-full overflow-x-auto",
    header:
      "bg-slate-50 h-12 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold border-b border-slate-200",
    row: "h-16 hover:bg-slate-50/50 border-b border-slate-100 transition-colors",
    cell: "px-4 align-middle text-sm text-slate-700",
  },
  typography: {
    heading: "text-2xl font-bold text-slate-900",
    sectionTitle: "text-lg font-semibold text-slate-800",
    body: "text-sm text-slate-600",
    hint: "text-xs text-slate-500",
  },
  icon: {
    sidebar: "h-[18px] w-[18px]",
    action: "h-4 w-4", // 16px
    stats: "h-5 w-5", // 20px
  },
};
