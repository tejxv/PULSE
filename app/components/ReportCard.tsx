"use client";

import { useState } from 'react';
import Link from 'next/link'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation';

interface Report {
  id: number
  analysis: string
  department: string
  created_at: string
  is_urgent: boolean
  is_bookmarked: boolean
}

export default function ReportCard({ report: initialReport }: { report: Report }) {
  const [report, setReport] = useState(initialReport);
  const supabase = createClient();
  const router = useRouter();

  // Extract the first meaningful line from the analysis
  const firstLine = report.analysis
    .split('\n')
    .find((line: string) => line.trim().startsWith('##'))
    ?.replace(/^#+\s*/, '')
    || 'Patient Report';

  // Clean up the content for preview
  const previewContent = report.analysis
    .split('\n')
    .filter((line: string) => {
      const trimmedLine = line.trim();
      // Skip markdown code block syntax and empty lines
      return trimmedLine && 
        !trimmedLine.startsWith('##') && 
        !trimmedLine.startsWith('```') &&
        !trimmedLine.startsWith('~~~');
    })
    .map((line: string) => 
      line
        .replace(/^\s*[-*]\s*/, '') // Remove list markers
        .replace(/\*\*/g, '') // Remove bold syntax
        .replace(/`/g, '') // Remove inline code syntax
    )
    .join(' ')
    .trim();

  const toggleUrgent = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newIsUrgent = !report.is_urgent;
    
    // Update local state immediately
    setReport(prev => ({ ...prev, is_urgent: newIsUrgent }));

    // Update in database
    const { error } = await supabase
      .from('reports')
      .update({ is_urgent: newIsUrgent })
      .eq('id', report.id);
    
    if (error) {
      console.error('Error updating urgent status:', error);
      // Revert local state if update failed
      setReport(prev => ({ ...prev, is_urgent: !newIsUrgent }));
    } else {
      // Refresh the server-side props to keep everything in sync
      router.refresh();
    }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newIsBookmarked = !report.is_bookmarked;
    
    // Update local state immediately
    setReport(prev => ({ ...prev, is_bookmarked: newIsBookmarked }));

    // Update in database
    const { error } = await supabase
      .from('reports')
      .update({ is_bookmarked: newIsBookmarked })
      .eq('id', report.id);
    
    if (error) {
      console.error('Error updating bookmark status:', error);
      // Revert local state if update failed
      setReport(prev => ({ ...prev, is_bookmarked: !newIsBookmarked }));
    } else {
      // Refresh the server-side props to keep everything in sync
      router.refresh();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200">
      <Link href={`/dashboard/${report.id}`} className="block p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {firstLine}
              </p>
              <p className="text-xs text-gray-500">
                {report.department}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleUrgent}
              className={`p-1 rounded-full transition-colors ${
                report.is_urgent 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-1 rounded-full transition-colors ${
                report.is_bookmarked 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={report.is_bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <span className="text-xs text-gray-500">
              #{report.id}
            </span>
          </div>
        </div>

        <div className="relative">
          <p className="text-sm text-gray-500 line-clamp-6">
            {previewContent}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-sm text-gray-500">
              {new Date(report.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              })}
            </time>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-600/10">
            View Report
          </span>
        </div>
      </Link>
    </div>
  )
} 