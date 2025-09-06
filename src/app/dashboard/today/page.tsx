
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import TodoList from '@/ui/TodoList'
import { CircleCheckBig } from 'lucide-react';

export default async function Today() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

// Get start & end of today in UTC
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTomorrow = new Date(startOfToday)
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)

  // Query only today's todos
  let { data: todos, error: todosError } = await supabase
    .from('todos')
    .select('*')
    .gte('due_at', startOfToday.toISOString())   // due_at >= 00:00 today
    .lt('due_at', startOfTomorrow.toISOString()) // due_at < 00:00 tomorrow
    .eq('user_id', data.user.id)                 // filter by logged-in user
    .order('due_at')

  return (
  <div className='flex flex-col flex-grow bg-white min-h-screen w-full text-black '>
    <div className="w-4/5 m-auto mt-20">
      <div className='mb-5'>
        <h1 className='text-3xl font-bold'>Today</h1>
        <p className='text-gray-400 text-sm'><CircleCheckBig size={15}  className='inline ' /> {todos?.length ?? 0} tasks</p>
      </div>
      <TodoList initialTodos={todos}/>
    </div>
    
  </div>
)
}