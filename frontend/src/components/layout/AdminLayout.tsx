"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle, Users, FileText, Settings, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: UserCircle },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar (fixed, full height) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 flex flex-col justify-between z-40">
        <div>
          <div className="p-6 text-white text-2xl font-bold">Blog Admin</div>
          <nav className="mt-8 flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-gray-800 text-indigo-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <button className="m-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-150">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>
      {/* Main Content (with left margin for sidebar) */}
      <main className="ml-64 p-10 min-h-screen bg-gray-50">{children}</main>
    </div>
  );
}
