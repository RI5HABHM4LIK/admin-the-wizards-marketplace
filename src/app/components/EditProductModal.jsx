"use client";

import { useState, useEffect } from "react";

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

export default function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    filter: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    newImageFile: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        newImageFile: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, newImageFile: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, onClose);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                handleChange(e);
                setFormData((prev) => ({ ...prev, filter: "" }));
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <div>
            <label className="block font-medium mb-1">Filter</label>
            <select
              name="filter"
              value={formData.filter}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select Filter</option>
              {formData.category &&
                filters[formData.category].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Current Image */}
          <div>
            <label className="block font-medium mb-1">Current Image</label>
            <img
              src={formData.image}
              alt={formData.name}
              className="w-32 h-32 object-cover rounded mb-2"
            />
            <label className="inline-block px-4 py-2 bg-orange-600 text-white rounded cursor-pointer hover:bg-orange-700 transition">
              Choose New Image
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {formData.newImageFile && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {formData.newImageFile.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
