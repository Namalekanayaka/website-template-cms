import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
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
        <div className="absolute pointer-events-none inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container flex items-end min-h-screen">
        <div className="w-full lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-16 pt-40">
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
