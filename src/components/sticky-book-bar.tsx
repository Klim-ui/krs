export function StickyBookBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <a
        href="#order"
        className="flex h-14 items-center justify-center rounded-xl bg-[#9f2f24] font-semibold text-white"
      >
        Забронировать без предоплаты
      </a>
    </div>
  );
}
