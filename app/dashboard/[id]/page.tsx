// app/protected/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import PrintButton from './components/PrintButton'
import ReportContent from './components/ReportContent'
import Footer from '../../components/Footer'
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
  searchParams: {
    new?: string
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
export default async function ReportPage({ params, searchParams }: PageParams) {
  const { id } = params
  const isNewReport = searchParams.new === 'true'
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
      {isNewReport && (
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm p-4 mt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2 mr-4">
                <svg className="h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800">Report generated successfully!</h3>
                <p className="text-sm text-emerald-700">
                  You can now view your detailed health analysis below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="group-hover:underline">Back to reports</span>
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

          <div className="prose max-w-none">
            <ReportContent content={report.analysis} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}