'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** how many page buttons to show at once (default 5) */
  windowSize?: number
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  windowSize = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate the window of page numbers to display
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, page - half)
  let end = Math.min(totalPages, start + windowSize - 1)
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const btn = (
    content: React.ReactNode,
    onClick: () => void,
    disabled = false,
    active = false,
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30"
      style={{
        backgroundColor: active
          ? '#13ec5b'
          : 'rgba(255,255,255,0.05)',
        color: active ? '#0b1a0f' : 'rgba(255,255,255,0.6)',
        border: active
          ? 'none'
          : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {content}
    </button>
  )

  return (
    <div className="flex items-center gap-2">
      {btn(
        <ChevronLeft size={14} className="text-white" />,
        () => onPageChange(Math.max(1, page - 1)),
        page === 1,
      )}

      {start > 1 && (
        <>
          {btn(1, () => onPageChange(1), false, page === 1)}
          {start > 2 && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              …
            </span>
          )}
        </>
      )}

      {pages.map((n) => btn(n, () => onPageChange(n), false, n === page))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              …
            </span>
          )}
          {btn(totalPages, () => onPageChange(totalPages), false, page === totalPages)}
        </>
      )}

      {btn(
        <ChevronRight size={14} className="text-white" />,
        () => onPageChange(Math.min(totalPages, page + 1)),
        page === totalPages,
      )}
    </div>
  )
}