"use client";
import { createClient } from "@/utils/supabase/client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgCalendarDates } from "react-icons/cg";
import { FiHome } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { LuPanelLeft } from "react-icons/lu";
import { MdOutlineToday } from "react-icons/md";

const ICON_SIZE = 20;



export default function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleLogOut = async () => {
    
    await supabase.auth.signOut();
    router.push('/'); // redirect after logout
};

  // Collapse sidebar by default on medium and small screens
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 740px)"); // md & below

    const handleResize = () => {
      setCollapsed(mediaQuery.matches); 
    };

    handleResize(); // run once on mount
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div
      className={clsx(
        "bg-amber-50 border-e h-full border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="relative flex flex-col h-full max-h-full">
        {/* Header */}
        <header className="p-4 pb-5 border-b border-gray-100 flex justify-between items-center gap-x-2">
          {!collapsed && (
            <Link
              className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80"
              href="/"
              aria-label="Brand"
            >
              Todo App
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(s => !s)}
            className="flex justify-center text-gray-800 items-center rounded-full hover:bg-gray-100 p-2"
          >
            <LuPanelLeft
              size={ICON_SIZE}
              className={clsx("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </header>

        {/* Nav */}
        <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-amber-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <ul className="space-y-1">
            <li>
              <Link
                className={clsx(
                  "flex items-center gap-x-3.5 py-2 px-5 text-sm rounded-lg hover:bg-amber-100",
                  pathname === "/dashboard"
                    ? "bg-amber-100 text-gray-900"
                    : "text-gray-800"
                )}
                href="/dashboard"
              >
                <FiHome size={19} />
                {!collapsed && "Inbox"}
              </Link>
            </li>

            <li>
              <Link
                className={clsx(
                  "flex items-center gap-x-3.5 py-2 px-5 text-sm rounded-lg hover:bg-amber-100",
                  pathname === "/dashboard/today"
                    ? "bg-amber-100 text-gray-900"
                    : "text-gray-800"
                )}
                href="/dashboard/today"
              >
                <MdOutlineToday size={ICON_SIZE} />
                {!collapsed && (
                  <>
                    Today
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center text-xs bg-gray-200 text-gray-800 rounded-full">
                      New
                    </span>
                  </>
                )}
              </Link>
            </li>

            <li>
              <Link
                className={clsx(
                  "flex items-center gap-x-3.5 py-2 px-5 text-sm rounded-lg hover:bg-amber-100",
                  pathname === "/dashboard/upcoming"
                    ? "bg-amber-100 text-gray-900"
                    : "text-gray-800"
                )}
                href="/dashboard/upcoming"
              >
                <CgCalendarDates size={ICON_SIZE} />
                {!collapsed && "Upcoming"}
              </Link>
            </li>
            {/* logout button */}
            <li>
              <button
                className="flex items-center w-full text-gray-800 grow gap-x-3.5 py-2 px-5 text-sm rounded-lg hover:bg-amber-100"
                onClick={handleLogOut}
              >
                <IoLogOutOutline size={22} />
                {!collapsed && "Log Out"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
