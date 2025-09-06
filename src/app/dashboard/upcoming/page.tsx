
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import TodoList from '@/ui/TodoList'
import { CircleCheckBig } from 'lucide-react';

export default async function Upcoming() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

// Get start & end of today in UTC
  const now = new Date()
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)


// Query only upcoming todos (from tomorrow onwards)
  let { data: todos, error: todosError } = await supabase
    .from('todos')
    .select('*')
    .gte('due_at', startOfTomorrow.toISOString())  // due_at >= tomorrow
    .eq('user_id', data.user.id)                   // filter by logged-in user
    .order('due_at')

  return (
  <div className='flex flex-col flex-grow bg-white min-h-screen w-full text-black '>
    <div className="w-4/5 m-auto mt-20">
      <div className='mb-5'>
        <h1 className='text-3xl font-bold'>Upcoming</h1>
        <p className='text-gray-400 text-sm'><CircleCheckBig size={15}  className='inline ' /> {todos?.length ?? 0} tasks</p>
      </div>
      <TodoList initialTodos={todos}/>
    </div>
    
  </div>
)
}