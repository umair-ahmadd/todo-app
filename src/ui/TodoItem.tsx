"use client";

import { useEffect, useRef, useState } from "react";
import { IoFlag } from "react-icons/io5";
import { Edit, Calendar, Flag, Trash2, Save, X } from "lucide-react";
import {
  toggleTodoComplete,
  updateTodoDate,
  updateTodoPriority,
  deleteTodo,
  editTodo,
} from "@/lib/actions";

// ---- Types ----
export type Todo = {
  id: string;
  title: string;
  description?: string | null;
  priority: number; // 1=red, 2=blue, 3=green
  completed: boolean;
  due_at?: string | null;
};
// Icon sizes
const ICON_SIZE = 15;

// ---- Tailwind-safe priority style map (all full class names, no string templates) ----
const PRIORITY_STYLES: Record<
  Todo["priority"],
  {
    ring: string;
    border: string;
    bg: string;
    text: string;
    dot: string;
    hoverBg: string;
  }
> = {
  1: {
    ring: "ring-red-600",
    border: "border-red-500",
    bg: "bg-red-500",
    text: "text-red-600",
    dot: "bg-red-500",
    hoverBg: "hover:bg-red-50",
  },
  2: {
    ring: "ring-blue-500",
    border: "border-blue-600",
    bg: "bg-blue-500",
    text: "text-blue-600",
    dot: "bg-blue-500",
    hoverBg: "hover:bg-blue-50",
  },
  3: {
    ring: "ring-gray-500",
    border: "border-gray-600",
    bg: "bg-gray-500",
    text: "text-gray-600",
    dot: "bg-gray-500",
    hoverBg: "hover:bg-gray-50",
  },
};

// Utility to format Supabase timestamp -> YYYY-MM-DD
function formatDate(dateString?: string | null): string | undefined {
  if (!dateString) return undefined;
  try {
    const d = new Date(dateString); // handles the +00 offset
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  } catch {
    return undefined;
  }
}

export default function TodoItem({
  todo,
  onDelete,
}: {
  todo: Todo;
  onDelete: (id: string) => void;
}) {
  const [completed, setCompleted] = useState(todo.completed);
  const [priority, setPriority] = useState<Todo["priority"]>(todo.priority);
  const [dueDate, setDueDate] = useState<string | undefined>(
    formatDate(todo.due_at)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const dateRef = useRef<HTMLDivElement | null>(null);
  const prioRef = useRef<HTMLDivElement | null>(null);

  // Close popovers on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        showDatePicker &&
        dateRef.current &&
        !dateRef.current.contains(e.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        showPriorityMenu &&
        prioRef.current &&
        !prioRef.current.contains(e.target as Node)
      ) {
        setShowPriorityMenu(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [showDatePicker, showPriorityMenu]);

  const p = PRIORITY_STYLES[priority];

  // Handlers
  const handleToggle = async () => {
    const next = !completed;
    setCompleted(next);
    try {
      await toggleTodoComplete(todo.id, next);
    } catch {
      setCompleted(!next); // revert on error
    }
  };

  const handleDateChange = async (value: string) => {
    setDueDate(value);
    try {
      await updateTodoDate(todo.id, value);
    } catch {
      // no revert source of truth, keep local for now
    } finally {
      setShowDatePicker(false);
    }
  };

  const handlePriorityChange = async (value: Todo["priority"]) => {
    const prev = priority;
    setPriority(value);
    try {
      await updateTodoPriority(todo.id, value);
    } catch {
      setPriority(prev);
    } finally {
      setShowPriorityMenu(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await editTodo(todo.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setIsEditing(false);
    } catch {
      // keep editing state so user can retry
    }
  };

  const handleCancelEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch {
      // ignore error, user can retry
    }
  };

  return (
    <div
      className={`group relative w-full border-gray-200 border-t-1 border-b-1 py-1.5  bg-white transition ${p.hoverBg}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {/* Rounded toggle with priority color */}

          {/* testing button */}
          <button type="button"
            role="checkbox"
            onClick={handleToggle}
            aria-pressed={completed}
            aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-50 border-2 ${p.border} focus:outline-none  focus:ring-offset-2`}
          >
            <span></span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="green"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-current"
            >
              {completed ? (
              <path
                className="scale-145 origin-center"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5056 9.00958C16.2128 8.71668 15.7379 8.71668 15.445 9.00958L10.6715 13.7831L8.72649 11.8381C8.43359 11.5452 7.95872 11.5452 7.66583 11.8381C7.37294 12.1309 7.37293 12.6058 7.66583 12.8987L10.1407 15.3736C10.297 15.5299 10.5051 15.6028 10.7097 15.5923C10.8889 15.5833 11.0655 15.5104 11.2023 15.3735L16.5056 10.0702C16.7985 9.77735 16.7985 9.30247 16.5056 9.00958Z"
                fill="currentColor"
              ></path>
            ) : null} 
              
            </svg>
            <span></span>
          </button>

          {/* Title */}
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-w-0 border-b border-gray-300 bg-transparent text-sm font-medium text-gray-800 outline-none"
              autoFocus
            />
          ) : (
            <span
              className={`break-words text-sm font-medium ${completed ? "text-gray-400" : "text-gray-800"}`}
              title={title}
            >
              {title}
            </span>
          )}
        </div>

        {/* Right actions (show on hover/focus or when editing) */}
        <div
          className={`flex items-center gap-1 transition ${
            isEditing
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
          }`}
        >
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1 text-sm font-medium text-gray-50 hover:bg-amber-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1 rounded-xl px-3 bg-gray-100 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* Edit */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl p-2 hover:bg-gray-100"
                aria-label="Edit"
              >
                <Edit size={ICON_SIZE} className="text-gray-600" />
              </button>

              {/* Date popover */}
              <div className="relative" ref={dateRef}>
                <button
                  type="button"
                  onClick={() => setShowDatePicker((s) => !s)}
                  className="rounded-xl p-2 hover:bg-gray-100"
                  aria-haspopup="dialog"
                  aria-expanded={showDatePicker}
                  aria-label="Change due date"
                >
                  <Calendar size={ICON_SIZE} className="text-gray-600" />
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 top-9 z-20 rounded-xl border bg-white p-2 shadow-lg">
                    <input
                      type="date"
                      defaultValue={dueDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="rounded-lg border px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Priority dropdown */}
              <div className="relative" ref={prioRef}>
                <button
                  type="button"
                  onClick={() => setShowPriorityMenu((s) => !s)}
                  className="rounded-xl p-2 hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded={showPriorityMenu}
                  aria-label="Change priority"
                >
                  <Flag size={ICON_SIZE} className={`${p.text}`} />
                </button>

                {showPriorityMenu && (
                  <div
                    role="menu"
                    className="absolute right-0 left-0.5 top-9 z-20 w-8 overflow-hidden rounded-lg bg-gray-50 shadow-lg"
                  >
                    {[1, 2, 3].map((val) => {
                      const s = PRIORITY_STYLES[val as 1 | 2 | 3];
                      return (
                        <button
                          key={val}
                          type="button"
                          role="menuitem"
                          onClick={() => handlePriorityChange(val as 1 | 2 | 3)}
                          className="flex w-full items-center gap-1 px-1 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <IoFlag size={15} className={s.text} />
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl p-2 hover:bg-gray-100"
                aria-label="Delete"
              >
                <Trash2 size={ICON_SIZE} className="text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-1 pl-8">
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-2 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
          />
        ) : description ? (
          <p
            className={`text-xs ${completed ? "text-gray-400" : "text-gray-500"}`}
          >
            {description}
          </p>
        ) : null}

        {/* Due date hint */}
        {dueDate ? (
          <p className="mt-1 text-xs text-gray-400">Due: {dueDate}</p>
        ) : null}
      </div>
    </div>
  );
}
