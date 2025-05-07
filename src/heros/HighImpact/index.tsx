'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section className="relative h-screen min-h-[1000px] flex items-center justify-center text-white overflow-hidden">
      {/* Background media with overlay */}
      <div className="absolute inset-0 z-0">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="object-cover w-full h-full scale-110 animate-zoom-in-out"
            priority
            resource={media}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-gray-900/40" />
      </div>

      {/* Content container */}
      <div className="container relative z-10 px-6">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          {richText && (
            <RichText
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg"
              data={richText}
              enableGutter={false}
            />
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                    i === 0
                      ? 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
                      : 'bg-transparent border-2 border-white hover:bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  )
}
