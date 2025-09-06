"use client";

import { useState } from "react";
import TodoItem from "./TodoItem";
import {} from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import AddTodo from "@/lib/AddTodo";
import { createClient } from "@/utils/supabase/client";




export type Todo = {
  id: string;
  title: string;
  description?: string | null;
  priority: number; // 1=red, 2=blue, 3=green
  completed: boolean;
  due_at?: string | null;
};



export default function TodoList({
  initialTodos,
}: {
  initialTodos: Todo[] | null;
}) {
  const [todos, setTodos] = useState(initialTodos);
  const [addingTask, setAddingTask] = useState(false);


  const handleDelete = (deletedId: string) => {
    setTodos((prevTodos) =>
      prevTodos ? prevTodos.filter((todo) => todo.id !== deletedId) : prevTodos
    );
  };

  // Handler to add a new todo to state
  const handleAddTodo = (newTodo: Todo) => {
    setTodos((prevTodos) => (prevTodos ? [newTodo, ...prevTodos] : [newTodo]));
    setAddingTask(false);
  };

  const handleCancel = () => {
    setAddingTask(false);
  };


  return (
    <div>
      {(!todos || todos.length === 0) && <div>No todos found. Add some!</div>}
      <ul className="flex flex-col justify-center items-center">
        {todos?.map((todo) => (
          <li className="flex flex-col w-full" key={todo.id}>
            <TodoItem todo={todo} onDelete={handleDelete} />
          </li>
        ))}
      </ul>

      {(!addingTask) ? (
        <button className="text-sm mt-4 px-3 py-1 text-white bg-amber-500 hover:bg-amber-600  border rounded-full "
        onClick={() => setAddingTask(prev => !prev)}>
          <IoIosAdd className="inline text-shadow-white mr-1" size={22} /> Add
          Task
        </button>
      ) : (
        <AddTodo handleCancel={handleCancel} handleAddTodo={handleAddTodo} />
      )}
    </div>
  );
}
