import { IoFlag } from "react-icons/io5";
import { addTodo } from "./actions";

import { useRef } from "react";

import { createClient } from "@/utils/supabase/client";

export default function AddTodo({
  handleCancel,
  handleAddTodo,
}: {
  handleCancel: () => void;
  handleAddTodo: (todo: any) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const supabase = createClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Not authenticated");
      return;
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const due_atString = formData.get("due_at") as string;
    const due_at = due_atString ? new Date(due_atString).toISOString() : null;
    const priorityString = formData.get("priority") as string;
    const priority = parseInt(priorityString, 10);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          title,
          description,
          due_at: due_at && due_at !== "" ? due_at : null,
          priority,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      alert("Error adding todo: " + error.message);
      return;
    }
    if (data && data[0]) {
      handleAddTodo(data[0]);
      if (formRef.current) formRef.current.reset();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full rounded-lg border border-gray-200 bg-white p-1 mb-10 m-0.5"
    >
      {/* Title */}
      <div>
        <input
          type="text"
          name="title"
          required
          placeholder="Add Task"
          className="w-full px-3 font-medium text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 "
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          name="description"
          required
          placeholder="Description"
          className="w-full  px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-0"
          rows={1}
        />
      </div>

      {/* Date + Priority */}
      <div className="flex items-center justify-between gap-3">

        {/* Due Date */}
        <div>
          <input
            name="due_at"
            type="date"
            className=" border-1 rounded-md border-gray-200 px-2 py-1 text-sm text-gray-800 focus:outline-none"
          />
        </div>
        {/* Priority */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Priority:</span>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="priority"
              value="1"
              className=""
            />
            <IoFlag size={15} className="text-red-600" />1
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="priority"
              value="2"
              className=""
            />
            <IoFlag size={15} className="text-blue-600" />2
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="priority"
              value="3"
              defaultChecked
              className=""
            />
            <IoFlag size={15} className="text-gray-300" />3
          </label>
        </div> 
        <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl px-3 bg-gray-100 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1 text-sm font-medium text-gray-50 hover:bg-amber-600"
        >
          Add Task
        </button>
      </div> 


      </div>

      {/* Footer buttons */}
      
    </form>
  );
}
