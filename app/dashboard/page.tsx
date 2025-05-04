import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ReportCard from "../components/ReportCard"
import QuickStats from "../components/QuickStats"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Get user metadata to check if they are a doctor
  const isDoctor = user.user_metadata?.user_type === 'doctor'

  // Fetch reports based on user type
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq(isDoctor ? 'is_visible_to_doctors' : 'user_id', isDoctor ? true : user.id)

  if (error) {
    console.error("Error fetching reports:", error)
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold dark:bg-blue-950 bg-blue-100 text-center">
          Welcome to PICO
        </div>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-5xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          {!isDoctor && (
            <>
              <Link
                href="/analyse"
                className="p-4 w-full bg-blue-600 tracking-wide text-center rounded-2xl hover:bg-black text-white shadow-xl hover:shadow-2xl hover:ring-4 hover:ring-black ring-1 ring-blue-700 transition-all"
              >
                Take the <span className="font-bold">Health Questionnaire</span>
              </Link>
              <p className="text-base text-gray-500 text-center">
                Helps your doctor give you better care, faster.
              </p>
            </>
          )}

          {/* Display QuickStats for doctors */}
          {isDoctor && reports && reports.length > 0 && (
            <QuickStats reports={reports} />
          )}

          {/* Display reports if they exist */}
          {reports && reports.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-8">
                {isDoctor ? '🏥 All Patient Reports' : '🔄 Your Previous Reports'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports
                  .filter((report) => report.analysis)
                  .map((report) => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      userType={isDoctor ? "doctor" : "patient"}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-12 px-6 border border-gray-200 max-w-md rounded-3xl py-8 opacity-70 gap-2 flex flex-col items-center justify-center bg-slate-100">
              <h1 className="font-semibold">
                {isDoctor ? 'No Reports Available' : 'No Previous Reports Found.'}
              </h1>
              <p className="text-center text-balance">
                {isDoctor 
                  ? 'There are currently no patient reports in the system.'
                  : 'Your previous health reports will show up here. Take your first Health Questionnaire to get started.'}
              </p>
            </div>
          )}
        </main>
      </div>
      <footer className="w-full border-t bg-white border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Meta x Pragati · Developed by{" "}
          <a
            href="#"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Code for Cure
          </a>
        </p>
      </footer>
    </div>
  )
}
