import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager - Team Productivity",
  description: "Manage your team's tasks efficiently with Task Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${outfit.className} min-h-full flex bg-background`}>
        <AuthProvider>
          <ProtectedRoute>
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
