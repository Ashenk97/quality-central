type PrintableCertificateProps = {
  recipientName: string
  completedOn: string
  verificationId: string
}

export function PrintableCertificate({
  recipientName,
  completedOn,
  verificationId,
}: PrintableCertificateProps) {
  return (
    <article
      id="certificate"
      className="relative aspect-[11/8.5] w-full max-w-[1100px] overflow-hidden bg-slate-950 text-slate-100 shadow-[0_24px_80px_-20px_rgba(79,70,229,0.45)] print:aspect-auto print:h-[100vh] print:max-w-none print:shadow-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_36%)]" />
      <div className="absolute inset-3 border border-indigo-400/70 print:inset-2" />
      <div className="absolute inset-5 border border-slate-600/80 print:inset-4" />

      <div className="relative flex h-full flex-col items-center justify-between px-10 py-8 text-center sm:px-16 sm:py-10">
        <header className="space-y-2">
          <p className="text-[0.7rem] font-medium tracking-[0.32em] text-indigo-300 uppercase">
            Quality Central
          </p>
          <p className="text-sm text-slate-400">Certificate of Completion</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Certified QA Automation Intern
          </h1>
        </header>

        <div className="space-y-3">
          <p className="text-sm tracking-wide text-slate-400">This certifies that</p>
          <p className="font-heading text-3xl font-semibold text-indigo-200 sm:text-4xl">
            {recipientName}
          </p>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            has completed the GENKI Wardrobe QA Sprint Simulation and demonstrated
            intern-ready practice in test planning, defect reporting, SQL
            verification, and Playwright automation.
          </p>
        </div>

        <footer className="grid w-full max-w-2xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
          <div className="border-t border-slate-700/80 pt-3">
            <p className="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase">
              Date of completion
            </p>
            <p className="mt-1 font-medium text-slate-200">{completedOn}</p>
          </div>
          <div className="border-t border-slate-700/80 pt-3 sm:text-right">
            <p className="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase">
              Verification ID
            </p>
            <p className="mt-1 font-mono text-sm text-indigo-200">{verificationId}</p>
          </div>
        </footer>
      </div>
    </article>
  )
}
