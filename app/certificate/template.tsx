import { PageTransition } from "@/components/layout/page-transition"

export default function CertificateTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
