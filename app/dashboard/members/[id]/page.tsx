import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import EditMemberForm from "./edit-form"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Awaiting params prevents Next.js 15 from returning an undefined Promise!
  const resolvedParams = await params;
  const memberId = resolvedParams?.id;

  console.log("PARAM ID:", memberId);

  if (!memberId) {
    return <div className="p-6 text-white font-bold text-xl">No Member ID received</div>;
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  let gymId = cookieStore.get('selected_gym_id')?.value

  const { data: { user } } = await supabase.auth.getUser()

  if (!gymId || gymId === 'undefined' || gymId === 'null') {
    if (user) {
      const { data } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      if (data?.id) gymId = data.id
    }
  }

  console.log('GYM ID USED FOR MEMBERS:', gymId)

  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .eq("gym_id", gymId)
    .single()

  if (error || !member) {
    return <div className="p-6 text-red-500 font-bold text-xl">Member not found in current gym</div>
  }

  // Fetch history for this member
  const { data: history } = await supabase
    .from("membership_history")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 text-white max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Member Profile & History</h1>
      <EditMemberForm member={member} history={history || []} />
    </div>
  )
}
