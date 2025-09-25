"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const errorShown = useRef(false); // 🚀 flag to prevent duplicate toasts

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/profile", {
          withCredentials: true,
        });

        if (data.role !== "admin") {
          if (!errorShown.current) {
            toast.error("Access denied. Admins only.");
            errorShown.current = true;
          }
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (!errorShown.current) {
          toast.error("Please login to access dashboard");
          errorShown.current = true;
        }
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-background">{children}</main>
    </div>
  );
}
