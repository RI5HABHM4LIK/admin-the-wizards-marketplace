"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import { toast } from "react-toastify";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div className="px-6 flex flex-col">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Image
            src="/logo.png"
            alt="Wizard Marketplace Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-heading">Wizard Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          <Link
            href="/dashboard/products"
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-heading"
          >
            All Products
          </Link>
          <Link
            href="/dashboard/create-product"
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-heading"
          >
            Create Product
          </Link>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-heading"
          >
            All Orders
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-2 mt-6 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
