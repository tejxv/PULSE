import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Footer from "./components/Footer"

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
    return null
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Restore clinical focus with AI-powered patient insights
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Pulse is your daily diagnostic co-pilot — streamlining prep, cutting burnout, and improving care quality.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="/login"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started
              </a>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">The Challenge</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Doctors are drowning in operational overhead
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Through deep conversations with hospital HoDs, local clinics, and vice chancellors, we uncovered a critical pain point: overwhelming cognitive load and reactive care due to fragmented data.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">The Solution</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pulse turns raw patient data into actionable morning briefings
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Reduced Mental Fatigue
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">No need to ask the basic questions again and again. Get a daily briefing with all the important information you need to know.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Proactive Diagnostics
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Start consultations with pre-considered plans and insights, enhancing the quality of care.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Improved TATM
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Improved Doctor's total turnaround time by getting daily insights delivered before your day begins, without the need for additional patient data.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-blue-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-200">Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How Pulse Works
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Information Gathering",
                  description: "Patient submits their health data to the platform."
                },
                {
                  step: "2",
                  title: "AI Aided Diagnosis",
                  description: "Our system of AI models provide a preliminary diagnosis and treatment plan."
                },
                {
                  step: "3",
                  title: "Doctors Review",
                  description: "Doctors review the diagnosis and treatment plan, and provide feedback."
                }
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                  </div>
                  <dt className="mt-4 font-semibold text-white">{item.title}</dt>
                  <dd className="mt-2 text-sm leading-7 text-blue-100">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
