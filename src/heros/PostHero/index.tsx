import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { CMSLink } from '@/components/Link'

export const PostHero: React.FC<{ post: Post; links?: Array<{ link: any }> }> = ({
  post,
  links,
}) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative -mt-[10.4rem]">
      {/* Hero Image Container */}
      <div className="absolute inset-0 w-full h-screen">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container flex flex-col min-h-screen">
        {/* Buttons at the top */}
        {Array.isArray(links) && links.length > 0 && (
          <div className="flex flex-wrap justify-end gap-4 pt-32 mb-6">
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

        {/* Main content at the bottom */}
        <div className="mt-auto w-full lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-16">
          <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
            <div className="flex flex-wrap gap-2 uppercase text-sm font-semibold tracking-wide mb-6">
              {categories?.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const { title: categoryTitle } = category
                  const titleToUse = categoryTitle || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <React.Fragment key={index}>
                      {titleToUse}
                      {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                    </React.Fragment>
                  )
                }
                return null
              })}
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">{title}</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16 border-t border-white/20 pt-8">
              {hasAuthors && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-white/80">Author</p>
                  <p className="font-medium">{formatAuthors(populatedAuthors)}</p>
                </div>
              )}
              {publishedAt && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-white/80">Date Published</p>
                  <time dateTime={publishedAt} className="font-medium">
                    {formatDateTime(publishedAt)}
                  </time>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
