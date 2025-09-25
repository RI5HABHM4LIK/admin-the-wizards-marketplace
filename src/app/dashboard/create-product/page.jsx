"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { toast } from "react-toastify";

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

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    filter: "",
    description: "",
    price: 0,
    stock: 0,
    newImageFile: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.filter) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("filter", formData.filter);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      data.append("stock", formData.stock.toString());

      if (formData.newImageFile) {
        data.append("image", formData.newImageFile);
      }

      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product created successfully!");
      setFormData({
        name: "",
        category: "",
        filter: "",
        description: "",
        price: 0,
        stock: 0,
        newImageFile: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
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
            required
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

        {/* Upload Image */}
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <label className="inline-block px-4 py-2 bg-orange-600 text-white rounded cursor-pointer hover:bg-orange-700 transition">
            Choose Image
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          {formData.newImageFile && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {formData.newImageFile.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
