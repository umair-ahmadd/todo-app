"use server";
import { createClient } from "@/utils/supabase/server";
import { title } from "process";

export async function toggleTodoComplete(id: string, completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ completed: completed })
    .eq("id", id);
  if (error) {
    console.error("Error updating todo toggle:", error);
  }
}

export async function updateTodoDate(id: string, dueDate: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ due_at: dueDate })
    .eq("id", id);
  if (error) {
    console.error("Error updating todo date:", error);
  }
}

export async function updateTodoPriority(id: string, priority: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ priority: priority })
    .eq("id", id);
  if (error) {
    console.error("Error updating todo priority:", error);
  }
}
export async function deleteTodo(id: string) {
  const supabase = await createClient();
  const response = await supabase.from("todos").delete().eq("id", id);
}

export async function editTodo(
  id: string,
  updates: { title: string; description: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ title: updates.title, description: updates.description })
    .eq("id", id);
  if (error) {
    console.error("Error updating todo:", error);
  }
}

export async function addTodo(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
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
    console.error("Error adding todo:", error);
  }
}
