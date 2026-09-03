import { PageTransition } from "@/components/page-transition"

export default function CertificateTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
