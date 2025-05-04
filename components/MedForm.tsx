"use client"
import Link from "next/link"
import { useState, useRef } from "react"
import Markdown from "react-markdown"
import { createClient } from "@/utils/supabase/client"

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
      // Collect QnA data
      const qnaData: Record<string, any> = {};
      categories.forEach(category => {
        qnaData[category.category] = category.questions.map((_, index) => ({
          question: category.questions[index].question,
          answer: formData.get(`qna[${category.category}][${index}][answer]`)
        }));
      });

      // Add follow-up questions and answers if any
      if (followUpQuestions.length > 0) {
        qnaData['Follow Up'] = followUpQuestions.map((question, index) => ({
          question,
          answer: formData.get(`followup[${index}]`)
        }));
      }

      // Get analysis from the API
      const analysisResponse = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qna: qnaData,
          department,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis');
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);

      // Save to Supabase
      await saveToSupabase({
        user_id: userId,
        doc_id: [], // Add document IDs if you're handling file uploads
        qna: qnaData,
        analysis: analysisData.analysis,
        department,
        visit_id: '', // Add visit ID if you're using it
      });

      setStatus("success");
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
      const res = await fetch(`${API_BASE_URL}/get_doctor_mapping`, {
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
          className="font-medium pt-4 pb-1"
        >
          {question.question}
        </label>
        <input
          type="text"
          name={`qna[${category.category}][${index}][answer]`}
          id={`qna[${category.category}][${index}][answer]`}
          className="px-3 mt-2 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
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
            disabled={status === "loading"}
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {status === "loading" ? "Submitting..." : "Submit Health Questionnaire"}
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
