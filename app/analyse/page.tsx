import { createClient } from "@/utils/supabase/server"
import Header from "@/components/Header"
import { redirect } from "next/navigation"
import MedForm from "@/components/MedForm"

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // console.log(user)
  if (!user) {
    return redirect("/login")
  }

  // const handleSubmit = async (formData: FormData) => {
  //   'use server'
  //   const title = formData.get('title')
  //   console.log(title)
  // }

  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          <div className="py-6 font-bold tracking-widest dark:bg-blue-950 bg-blue-100 text-center">
            ANALYSE YOUR HEALTH
          </div>
        </div>
        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
          <MedForm userId={user?.id ?? ""} />
        </div>
        <footer className="w-full border-t bg-white border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Meta x Pragati             <a
              href="#"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              
            </a>
          </p>
        </footer>
      </div>
    </>
  )
}
