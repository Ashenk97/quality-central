export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      <div
        className="absolute inset-0 opacity-70 light:opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% -8%, #000 18%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 65% at 50% -8%, #000 18%, transparent 72%)",
        }}
      />
      <div className="absolute -top-28 -right-16 size-[34rem] rounded-full bg-qa-primary/25 blur-[140px] light:bg-qa-primary/15" />
    </div>
  )
}
