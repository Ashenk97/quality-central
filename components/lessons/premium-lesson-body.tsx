import {
  MDXRemote,
  type MDXRemoteOptions,
} from "next-mdx-remote-client/rsc"
import remarkGfm from "remark-gfm"

import { UpgradeToProCard } from "@/components/lessons/upgrade-to-pro-card"
import { MDXWrapper } from "@/components/mdx/mdx-wrapper"
import { mdxComponents } from "@/components/mdx/mdx-components"
import { MdxError } from "@/components/mdx/mdx-error"
import { splitLessonPreview } from "@/lib/content"

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

function LessonMdx({ source }: { source: string }) {
  if (!source.trim()) {
    return null
  }

  return (
    <MDXWrapper>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={mdxOptions}
        onError={MdxError}
      />
    </MDXWrapper>
  )
}

export function PremiumLessonBody({
  content,
  gated,
  signedIn,
  priceId,
  nextPath,
}: {
  content: string
  gated: boolean
  signedIn: boolean
  priceId: string | null
  nextPath: string
}) {
  if (!gated) {
    return <LessonMdx source={content} />
  }

  const { preview, remainder } = splitLessonPreview(content)

  return (
    <div>
      <LessonMdx source={preview || content} />
      {remainder ? (
        <div className="relative mt-4 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none max-h-96 select-none overflow-hidden"
            style={{ filter: "blur(5px)" }}
          >
            <LessonMdx source={remainder} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0A0A0A]/10 via-[#0A0A0A]/70 to-[#0A0A0A] p-4">
            <UpgradeToProCard
              priceId={priceId}
              signedIn={signedIn}
              nextPath={nextPath}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <UpgradeToProCard
            priceId={priceId}
            signedIn={signedIn}
            nextPath={nextPath}
          />
        </div>
      )}
    </div>
  )
}
