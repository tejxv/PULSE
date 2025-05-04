"use client"

import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white border-t-foreground/10">
      <div className="w-full max-w-5xl mx-auto py-8 px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Team Name */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              A platform for AI-powered healthcare
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <div className="mt-4 space-y-2">
              <Link 
                href="#" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                Watch Demo
              </Link>
              <Link 
                href="/#" 
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                About Project
              </Link>
              <Link 
                href="#" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                GitHub Repository
              </Link>
            </div>
          </div>

          {/* Team */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Team
            </h3>
            <div className="mt-4 space-y-2">
              <Link 
                href="#" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                Name
              </Link>
              <Link 
                href="#" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                Name
              </Link>
              <Link 
                href="#" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 block"
              >
                Name
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            {/* Made with ❤️ by{" "}
            <Link
              href="#"
              target="_blank"
              className="font-medium hover:text-gray-900"
            >
            </Link> */}
            {/* {" · "} */}
            <span>Meta x Pragati</span>
          </p>
        </div>
      </div>
    </footer>
  )
} 