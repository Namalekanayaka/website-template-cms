'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

// Alternative header styling with a sleeker, more minimalist approach
const styles = `
  /* Base header styles */
  header.modern-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  /* Header container styling */
  header.modern-header .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1.5rem 2rem;
    transition: padding 0.3s ease, background-color 0.3s ease;
    border-radius: 0 0 20px 20px;
    margin: 0 1rem;
  }

  /* Scroll state */
  header.modern-header.scrolled {
    position: fixed;
    transform: translateY(0);
  }

  header.modern-header.scrolled .header-inner {
    padding: 0.75rem 1.5rem;
    margin: 0.5rem 1rem;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  }

  header.modern-header.hidden {
    transform: translateY(-100%);
  }

  /* Theme-specific styling */
  header.modern-header[data-theme="light"] .header-inner {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  header.modern-header[data-theme="light"].scrolled .header-inner {
    background-color: rgba(255, 255, 255, 0.95);
  }

  header.modern-header[data-theme="dark"] .header-inner {
    background-color: rgba(18, 18, 18, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  header.modern-header[data-theme="dark"].scrolled .header-inner {
    background-color: rgba(18, 18, 18, 0.95);
  }

  /* Logo styling */
  header.modern-header .logo-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    padding: 0.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  header.modern-header .logo-wrapper:hover {
    transform: translateY(-2px);
  }

  header.modern-header[data-theme="light"] .logo-wrapper:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  header.modern-header[data-theme="dark"] .logo-wrapper:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  /* Progress bar along bottom of header */
  header.modern-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: var(--scroll-width, 0%);
    background: linear-gradient(90deg, #3490dc, #6574cd);
    transition: width 0.2s ease;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    header.modern-header .header-inner {
      padding: 1rem;
      margin: 0 0.5rem;
      border-radius: 0 0 15px 15px;
    }
    
    header.modern-header.scrolled .header-inner {
      padding: 0.75rem 1rem;
      margin: 0.25rem 0.5rem;
    }
  }

  /* Animation for initial appearance */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  header.modern-header {
    animation: slideDown 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }
`

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Scroll handling with direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrolled = currentScrollY > 50

      // Update scroll progress indicator
      const scrollPercent = Math.min(
        (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
        100,
      )
      document.documentElement.style.setProperty('--scroll-width', `${scrollPercent}%`)

      // Determine scroll direction for hiding/showing header
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setScrolled(isScrolled)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.innerHTML = styles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <header
      className={`container modern-header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="header-inner">
        <Link href="/" className="logo-wrapper">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
