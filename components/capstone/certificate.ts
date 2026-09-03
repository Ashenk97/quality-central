export function downloadQaInternCertificate(name: string) {
  const width = 1400
  const height = 990
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return
  }

  const printed = name.trim() || "QA Intern"

  ctx.fillStyle = "#0f172a"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "#6366f1"
  ctx.lineWidth = 18
  ctx.strokeRect(36, 36, width - 72, height - 72)
  ctx.strokeStyle = "#34d399"
  ctx.lineWidth = 4
  ctx.strokeRect(58, 58, width - 116, height - 116)

  ctx.fillStyle = "#a5b4fc"
  ctx.font = "600 22px ui-sans-serif, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("QUALITY CENTRAL", width / 2, 160)

  ctx.fillStyle = "#e2e8f0"
  ctx.font = "600 28px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText("Certificate of Completion", width / 2, 230)

  ctx.fillStyle = "#f8fafc"
  ctx.font = "700 56px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText("QA Intern Ready", width / 2, 340)

  ctx.fillStyle = "#94a3b8"
  ctx.font = "400 22px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText("This certifies that", width / 2, 420)

  ctx.fillStyle = "#6ee7b7"
  ctx.font = "700 44px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText(printed, width / 2, 490)

  ctx.fillStyle = "#cbd5e1"
  ctx.font = "400 22px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText(
    "completed the GENKI Wardrobe QA Sprint Simulation:",
    width / 2,
    560
  )
  ctx.fillText(
    "hoodie checkout planning, Sandbox bugs, Failed-order SQL, and Playwright.",
    width / 2,
    598
  )

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  ctx.fillStyle = "#94a3b8"
  ctx.font = "500 18px ui-sans-serif, system-ui, sans-serif"
  ctx.fillText(date, width / 2, 700)
  ctx.fillStyle = "#818cf8"
  ctx.fillText("Quality Central  ·  Intern track", width / 2, 760)

  canvas.toBlob((blob) => {
    if (!blob) {
      return
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "qa-intern-ready-certificate.png"
    link.click()
    URL.revokeObjectURL(url)
  }, "image/png")
}
