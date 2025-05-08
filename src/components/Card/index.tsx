'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props
  const [isHovered, setIsHovered] = useState(false)

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-opacity-30 border-gray-200 dark:border-gray-700',
        'transition-all duration-500 ease-in-out shadow-sm hover:shadow-xl',
        'backdrop-blur-sm hover:backdrop-blur-md',
        'transform hover:-translate-y-2',
        'flex flex-col h-full',
        className,
      )}
      ref={card.ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass effect top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>

      {/* Image container with hover zoom effect */}
      <div className="relative w-full aspect-video overflow-hidden">
        {!metaImage && (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <span className="text-gray-400 dark:text-gray-500 font-medium">No image</span>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="w-full h-full transform transition-transform duration-700 ease-in-out group-hover:scale-110">
            <Media resource={metaImage} size="33vw" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
      </div>

      {/* Content container */}
      <div className="flex flex-col flex-grow p-6 space-y-4 relative z-10">
        {/* Categories */}
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'

                return (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs font-medium bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {categoryTitle}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Title with underline animation effect */}
        {titleToUse && (
          <div className="prose">
            <h3 className="font-bold text-xl mb-0 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              <Link className="not-prose relative inline-block" href={href} ref={link.ref}>
                {titleToUse}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </Link>
            </h3>
          </div>
        )}

        {/* Description with fade-in effect */}
        {description && (
          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 transform transition-all duration-500">
            <p>{sanitizedDescription}</p>
          </div>
        )}

        {/* Read more indicator */}
        <div className="mt-auto pt-2 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Read article</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>

      {/* Interactive overlay corner accent */}
      <div
        className={`absolute bottom-0 right-0 w-16 h-16 rounded-tl-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      ></div>
    </article>
  )
}
