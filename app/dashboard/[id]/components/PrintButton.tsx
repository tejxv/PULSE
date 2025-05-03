'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors print:hidden"
    >
      <Printer className="w-4 h-4 mr-2" />
      <span>Print</span>
    </button>
  )
} 