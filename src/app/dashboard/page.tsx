// import { redirect } from 'next/navigation'
// import { fakedata } from '@/lib/fakedata'
import { createClient } from '@/utils/supabase/server'
import TodoList from '@/ui/TodoList'
import { CircleCheckBig } from 'lucide-react';

export default async function PrivatePage() {
  const supabase = await createClient()

  // const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect('/login')
  // }

  let { data: todos, error: todosError } = await supabase
  .from('todos')
  .select('*')
  .order('due_at');
 
  // fake data for testing
  // const todos = fakedata;

  return (
  <div className='flex flex-col bg-white min-h-screen w-full text-black '>
    <div className="w-4/5 m-5 sm:ml-15 mt-20">
      <div className='mb-5'>
        <h1 className='text-3xl font-bold'>Inbox</h1>
        <p className='text-gray-400 text-sm'><CircleCheckBig size={15}  className='inline ' /> {todos?.length ?? 0} tasks</p>
      </div>
      <TodoList initialTodos={todos}/>
    </div>
    
  </div>
)
}