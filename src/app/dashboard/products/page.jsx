"use client";

import EditProductModal from "../../components/EditProductModal";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const categories = [
  "Herbology",
  "Potions",
  "Artifacts",
  "Quidditch & House Gear",
];

const filters = {
  Herbology: ["Healing", "Dangerous", "Rare"],
  Potions: ["Beginner", "Advanced", "Restricted"],
  Artifacts: ["Common", "Rare", "Legendary"],
  "Quidditch & House Gear": ["Brooms", "House Clothing", "Accessories"],
};

const filterColors = {
  Healing: "bg-green-100 text-green-800",
  Dangerous: "bg-red-100 text-red-800",
  Rare: "bg-purple-100 text-purple-800",
  Beginner: "bg-blue-100 text-blue-800",
  Advanced: "bg-indigo-100 text-indigo-800",
  Restricted: "bg-red-200 text-red-900",
  Common: "bg-gray-100 text-gray-800",
  Legendary: "bg-yellow-100 text-yellow-800",
  Brooms: "bg-orange-100 text-orange-800",
  "House Clothing": "bg-pink-100 text-pink-800",
  Accessories: "bg-teal-100 text-teal-800",
};

export default function ProductsPage() {
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (formData, closeModal) => {
    try {
      const data = new FormData();
      data.append("name", formData.name || "");
      data.append("category", formData.category || "");
      data.append("filter", formData.filter || "");
      data.append("description", formData.description || "");
      data.append("price", formData.price?.toString() || "0");
      data.append("stock", formData.stock?.toString() || "0");
      if (formData.newImageFile) {
        data.append("image", formData.newImageFile);
      }

      const res = await api.put(`/products/${formData._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the products array immediately
      setProducts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );

      toast.success("Product updated successfully!");
      closeModal(); // close modal AFTER updating products
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div>Loading products...</div>;

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (category ? product.category === category : true) &&
      (filter ? product.filter === filter : true)
    );
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent flex-1"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setFilter("");
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Filters</option>
          {category &&
            filters[category].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">
          Nothing found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2 text-heading">
                    {product.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        filterColors[product.filter] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.filter}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">
                    {product.description}
                  </p>
                  <div className="mt-auto flex justify-between items-center mb-2">
                    <span className="text-orange-600 font-bold">
                      ${product.price}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 py-1 text-white bg-red-600 rounded hover:bg-red-700 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(formData, closeModal) => handleSave(formData, closeModal)}
        />
      )}
    </div>
  );
}
