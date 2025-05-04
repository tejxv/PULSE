"use client"
import Link from "next/link"
import { useState, useRef } from "react"
import Markdown from "react-markdown"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { customFetch } from "@/app/utils/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const categories = [
  {
    category: "General",
    questions: [
      {
        question: "Purpose of Visit",
      },
      {
        question: "What is your age and Sex?",
      },
      {
        question:
          "What are your main symptoms and for how long have you been experiencing them?",
      },
      {
        question:
          "Are you currently taking any medications? If so, what are they?",
      },
      {
        question: "Are there any hereditary conditions in your family?",
      },
      {
        question: "Do you have any known allergies?",
      },
    ],
  },
]
const departments = [
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Dermatology",
  "Cardiology",
  "Neurology",
  "Gastroenterology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
]

interface SaveToSupabaseParams {
  user_id: string;
  doc_id: string[];
  qna: any; // Keep this as any since the structure is complex
  analysis: string;
  department: string;
  visit_id: string;
}

interface FileUploadResponse {
  doc_id: string;
  doc_name: string;
}

interface Category {
  category: string;
  questions: { question: string }[];
}

interface UploadReportsResponse {
  doc_id: string;
  doc_name: string;
}

export default function MedForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState("idle")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [department, setDepartment] = useState(departments[0])
  const [followUpQuestions, setFollowUpQuestions] = useState<any[]>([])
  const [initialQna, setInitialQna] = useState<Record<string, any>>({})
  const [doctorMapping, setDoctorMapping] = useState<any>(null)
  const [showDoctorMapping, setShowDoctorMapping] = useState(false)
  const [isVisibleToDoctors, setIsVisibleToDoctors] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const uploadReports = async (file: File): Promise<string> => {
    // Implementation here
    return "dummy-id"
  }

  const saveToSupabase = async ({
    user_id,
    doc_id,
    qna,
    analysis,
    department,
    visit_id,
  }: SaveToSupabaseParams) => {
    const { data, error } = await supabase.from("reports").insert([
      {
        user_id,
        reports: doc_id,
        responses: qna,
        analysis,
        department,
        visit_id,
        is_visible_to_doctors: isVisibleToDoctors,
      },
    ])
    if (error) {
      console.log(error)
    }
  }

  const handleFileUpload = async (file: File): Promise<FileUploadResponse> => {
    // Implementation here
    return { doc_id: "dummy", doc_name: "dummy" }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("loading");
    const formData = new FormData(formRef.current);
    
    try {
      // Collect initial QnA data
      const qnaData: Record<string, any> = {};
      categories.forEach(category => {
        qnaData[category.category] = category.questions.map((_, index) => ({
          question: category.questions[index].question,
          answer: formData.get(`qna[${category.category}][${index}][answer]`)
        }));
      });

      // If we don't have follow-up questions yet, get them first
      if (followUpQuestions.length === 0) {
        setStatus("getting-followup");
        
        // Get follow-up questions from the API
        const followUpResponse = await customFetch(`${API_BASE_URL}/get_followup_questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qna: qnaData,
            department,
          }),
        });

        if (!followUpResponse.ok) {
          throw new Error('Failed to get follow-up questions');
        }

        const followUpData = await followUpResponse.json();
        if (followUpData.success && Array.isArray(followUpData.followup_questions)) {
          setFollowUpQuestions(followUpData.followup_questions);
          setStatus("idle");
          return; // Stop here and wait for user to answer follow-up questions
        } else {
          throw new Error('Invalid follow-up questions format');
        }
      }

      // Prepare the final QnA data in the format expected by the API
      const finalQnaData: Record<string, string> = {};
      
      // Add initial questions and answers
      categories.forEach(category => {
        category.questions.forEach((q, index) => {
          finalQnaData[q.question] = formData.get(`qna[${category.category}][${index}][answer]`) as string;
        });
      });

      // Add follow-up questions and answers
      if (followUpQuestions.length > 0) {
        followUpQuestions.forEach((question, index) => {
          finalQnaData[question] = formData.get(`followup[${index}]`) as string;
        });
      }

      // Get the analysis from the API
      const analysisResponse = await customFetch(`${API_BASE_URL}/get_summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          qna: finalQnaData,
          doc_id: "",
          department,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis');
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);

      // Save to Supabase and get the report ID
      const { data: reportData, error: saveError } = await supabase.from("reports").insert([
        {
          user_id: userId,
          reports: [], // Add document IDs if you're handling file uploads
          responses: finalQnaData,
          analysis: analysisData.analysis,
          department,
          visit_id: '', // Add visit ID if you're using it
          is_visible_to_doctors: isVisibleToDoctors,
        },
      ]).select('id').single();

      if (saveError) {
        throw saveError;
      }

      setStatus("success");
      
      // Redirect to the report page
      router.push(`/dashboard/${reportData.id}?new=true`);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus("error");
    }
  };

  const handleVisitIdSubmit = async (visitId: string) => {
    // Implementation here
  }

  const handleFetchDoctorMapping = async (visitId: string) => {
    try {
      const res = await customFetch(`${API_BASE_URL}/get_doctor_mapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_id: visitId,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setDoctorMapping(json.doctor_mapping)
        setShowDoctorMapping(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const renderQuestions = (category: Category) => {
    return category.questions.map((question, index) => (
      <div key={index} className="py-2">
        <label
          htmlFor={`qna[${category.category}][${index}][answer]`}
          className={`font-medium pt-4 pb-1 ${followUpQuestions.length > 0 ? 'opacity-60' : ''}`}
        >
          {question.question}
        </label>
        <input
          type="text"
          name={`qna[${category.category}][${index}][answer]`}
          id={`qna[${category.category}][${index}][answer]`}
          className={`px-3 mt-2 py-2.5 border h-auto bg-transparent bg-white w-full border-gray-200 hover:border-gray-300 outline-none appearance-none transition-all shadow-sm rounded-xl ${
            followUpQuestions.length > 0 ? 'opacity-60 cursor-not-allowed' : 'opacity-80'
          }`}
          disabled={followUpQuestions.length > 0}
        />
      </div>
    ))
  }

  const renderFollowUpQuestions = () => {
    return followUpQuestions.slice(0, 5).map((question: any, index: any) => (
      <div key={index} className="py-2">
        <label htmlFor={`followup[${index}]`} className="font-medium pt-4 pb-1">
          {question}
        </label>
        <input
          type="text"
          name={`followup[${index}]`}
          id={`followup[${index}]`}
          className="px-3 mt-2 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
        />
      </div>
    ))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-md text-gray-600 mt-4 pl-3.5 font-medium">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isVisibleToDoctors"
          checked={isVisibleToDoctors}
          onChange={(e) => setIsVisibleToDoctors(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="isVisibleToDoctors" className="text-sm text-gray-600">
          Make this report visible to doctors
        </label>
      </div>

      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="flex flex-col gap-8"
      >
        {categories.map((category) => (
          <div key={category.category} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{category.category}</h2>
            {renderQuestions(category)}
          </div>
        ))}

        {followUpQuestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-6 mb-4">Follow-up Questions</h3>
            {renderFollowUpQuestions()}
          </div>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={status === "loading" || status === "getting-followup"}
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              status === "loading" || status === "getting-followup" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {status === "loading" ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Report...
              </div>
            ) : status === "getting-followup" ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Follow-up Questions...
              </div>
            ) : followUpQuestions.length > 0 ? (
              "Submit Final Responses"
            ) : (
              "Continue"
            )}
          </button>
        </div>

        {status === "error" && (
          <div className="mt-4 p-4 text-red-700 bg-red-100 rounded-xl">
            An error occurred while submitting the form. Please try again.
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 p-4 text-green-700 bg-green-100 rounded-xl">
            Form submitted successfully!
          </div>
        )}

        {analysis && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Analysis</h3>
            <Markdown>{analysis}</Markdown>
          </div>
        )}
      </form>
    </div>
  )
}
