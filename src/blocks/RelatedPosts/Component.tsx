import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <Card
                doc={doc}
                relationTo="posts"
                showCategories
                className="h-full bg-white dark:bg-gray-800"
              />
              {/* Glow effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 dark:to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
