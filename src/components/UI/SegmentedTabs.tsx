interface SegmentedTabsProps<T extends string> {
  tabs: ReadonlyArray<{ readonly id: NoInfer<T>; readonly label: string }>
  activeTab: T
  onChange: (tab: T) => void
}

const indicatorGlassStyle = {
  background: 'var(--color-white-14)',
  boxShadow: 'var(--shadow-glass-indicator)',
} as const

export function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: SegmentedTabsProps<T>) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab)

  return (
    <div className="relative flex w-full rounded-full p-1 bg-white-10 overflow-hidden">
      {activeIndex >= 0 && (
        <div
          className="absolute top-1 bottom-1 left-1 rounded-full pointer-events-none will-change-transform transition-transform duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{
            width: `calc((100% - 8px) / ${tabs.length})`,
            transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
            ...indicatorGlassStyle,
          }}
        />
      )}
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className="relative z-10 flex flex-1 min-w-0 cursor-pointer items-center justify-center rounded-full py-3 text-[16px] font-semibold text-white"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
