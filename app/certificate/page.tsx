import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { PrintCertificateButton } from "@/components/certificate/print-button"
import { PrintableCertificate } from "@/components/certificate/printable-certificate"
import { Button } from "@/components/ui/button"
import { requireUser } from "@/lib/auth/session"
import {
  createVerificationId,
  formatCompletionDate,
  getCertificateRecipient,
} from "@/lib/certificate"

export const metadata: Metadata = {
  title: "Certified QA Automation Intern",
  description:
    "Print or save your Quality Central QA Automation Intern certificate.",
}

export default async function CertificatePage() {
  await requireUser("/certificate")
  const { name: recipientName, userId } = await getCertificateRecipient()
  const completedOn = new Date()

  return (
    <div className="min-h-svh bg-slate-950 text-slate-100 print:min-h-0 print:bg-slate-950">
      <header className="print:hidden flex h-14 items-center justify-between border-b border-border px-4 md:px-8">
        <Brand className="text-slate-100 [&_span:last-child]:text-slate-400" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-slate-200 hover:bg-slate-800" asChild>
            <Link href="/courses/capstone/01-sandbox-challenge">
              Back to capstone
            </Link>
          </Button>
          <PrintCertificateButton />
        </div>
      </header>

      <main
        id="main-content"
        className="flex justify-center px-4 py-8 pb-24 md:px-8 print:p-0"
      >
        <PrintableCertificate
          recipientName={recipientName}
          completedOn={formatCompletionDate(completedOn)}
          verificationId={createVerificationId(userId, completedOn)}
        />
      </main>
    </div>
  )
}
