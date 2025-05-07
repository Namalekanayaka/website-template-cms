'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

// Enhanced header styling with dynamic, eye-catching design elements
const styles = `
  /* Base header styles with refined aesthetics */
  header.premium-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  /* Header container with glass morphism effect */
  header.premium-header .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1.25rem 2.5rem;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    margin: 0 1.5rem;
    border-radius: 0 0 30px 30px;
    overflow: hidden;
  }

  /* Glassmorphism background overlay */
  header.premium-header .header-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    backdrop-filter: blur(12px);
    transition: all 0.4s ease;
  }

  /* Dynamic glow effect behind the header */
  header.premium-header .header-glow {
    position: absolute;
    top: -50%;
    left: -10%;
    width: 120%;
    height: 200%;
    background: radial-gradient(
      ellipse at center,
      rgba(125, 185, 255, 0.15) 0%,
      rgba(125, 185, 255, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.8s ease;
    z-index: -2;
    pointer-events: none;
    transform: translateZ(0);
  }

  header.premium-header:hover .header-glow {
    opacity: 1;
  }

  /* Scroll state with smooth transitions */
  header.premium-header.scrolled {
    position: fixed;
    transform: translateY(0);
  }

  header.premium-header.scrolled .header-container {
    padding: 0.75rem 2rem;
    margin: 0.75rem 1.5rem;
    box-shadow: 0 15px 35px -15px rgba(0, 0, 0, 0.1);
  }

  header.premium-header.hidden {
    transform: translateY(-110%);
  }

  /* Theme-specific styling with enhanced contrasts */
  header.premium-header[data-theme="light"] .header-container::before {
    background-color: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  header.premium-header[data-theme="light"].scrolled .header-container::before {
    background-color: rgba(255, 255, 255, 0.9);
  }

  header.premium-header[data-theme="dark"] .header-container::before {
    background-color: rgba(15, 15, 20, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  header.premium-header[data-theme="dark"].scrolled .header-container::before {
    background-color: rgba(15, 15, 20, 0.9);
  }

  /* Logo styling with hover animations */
  header.premium-header .logo-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    padding: 0.5rem;
    transition: all 0.4s ease;
  }

  header.premium-header .logo-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3490dc, #6574cd);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s ease;
  }

  header.premium-header .logo-wrapper:hover {
    transform: translateY(-3px);
  }

  header.premium-header .logo-wrapper:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  header.premium-header[data-theme="light"] .logo-wrapper:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  header.premium-header[data-theme="dark"] .logo-wrapper:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  /* Advanced progress bar with gradient */
  .scroll-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: var(--scroll-width, 0%);
    background: linear-gradient(90deg, #3490dc, #6574cd, #9561e2);
    background-size: 200% auto;
    animation: gradient 3s linear infinite;
    transition: width 0.3s ease;
    border-radius: 0 3px 3px 0;
    z-index: 10;
  }

  @keyframes gradient {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  /* Animated dots for loading indicator */
  .header-dots {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    display: flex;
    justify-content: space-between;
    opacity: 0.5;
    pointer-events: none;
  }

  .header-dots span {
    width: 3px;
    height: 3px;
    background-color: #3490dc;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite alternate;
  }

  .header-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .header-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  /* Responsive styles with smoother transitions */
  @media (max-width: 768px) {
    header.premium-header .header-container {
      padding: 1rem 1.25rem;
      margin: 0 0.75rem;
      border-radius: 0 0 20px 20px;
    }
    
    header.premium-header.scrolled .header-container {
      padding: 0.75rem 1rem;
      margin: 0.5rem 0.75rem;
    }
  }

  /* Enhanced animations */
  @keyframes floatIn {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  header.premium-header {
    animation: floatIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }
`

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Enhanced scroll handling with improved performance
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrolled = currentScrollY > 30

      // Update scroll progress indicator with optimized calculation
      const docHeight =
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight,
        ) - window.innerHeight

      const scrollPercent = Math.min((currentScrollY / docHeight) * 100, 100)
      document.documentElement.style.setProperty('--scroll-width', `${scrollPercent}%`)

      // Smart header visibility with hysteresis to prevent flickering
      if (currentScrollY > lastScrollY + 10 && currentScrollY > 200) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 150) {
        setHidden(false)
      }

      setScrolled(isScrolled)
      setLastScrollY(currentScrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [lastScrollY])

  // Mouse movement tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

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
      className={`premium-header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="header-container">
        <div
          className="header-glow"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />

        <Link href="/" className="logo-wrapper">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>

        <HeaderNav data={data} />

        <div className="scroll-progress-bar"></div>
        <div className="header-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  )
}
