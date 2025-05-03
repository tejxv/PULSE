// app/protected/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import PrintButton from './components/PrintButton'
import ReportContent from './components/ReportContent'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

interface Report {
  id: number
  created_at: string
  analysis: string
  user_id: string
  is_visible_to_doctors: boolean
}

interface PageParams {
  params: {
    id: string
  }
}

// Fetch report data based on report ID and user type
async function fetchReport(id: string, user_id: string, isDoctor: boolean): Promise<Report | null> {
  const supabase = createClient()

  let query = supabase
    .from('reports')
    .select('*')
    .eq('id', id)

  // If user is not a doctor, only allow them to see their own reports
  if (!isDoctor) {
    query = query.eq('user_id', user_id)
  } else {
    // For doctors, only show reports that are visible to doctors
    query = query.eq('is_visible_to_doctors', true)
  }

  const { data: report, error }: PostgrestSingleResponse<Report> = await query.single()

  if (error) {
    console.error('Error fetching report:', error)
    return null
  }

  return report
}

// The page component for displaying the report
export default async function ReportPage({ params }: PageParams) {
  const { id } = params
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Check if user is a doctor
  const isDoctor = user.user_metadata?.user_type === 'doctor'

  const report = await fetchReport(id, user.id, isDoctor)

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No report found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to reports</span>
          </Link>
          <PrintButton />
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Report #{report.id}
          </h1>
          
          <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <time dateTime={report.created_at}>
              {new Date(report.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
              })}
            </time>
            <span className="mx-2">–</span>
            <span>
              {formatDistanceToNow(new Date(report.created_at), {
                addSuffix: false,
              })}
            </span>
          </div>

          <ReportContent content={report.analysis} />
        </div>
      </div>
    </div>
  )
}
