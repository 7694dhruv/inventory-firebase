import React, { useEffect, useState } from "react";
import { db, ref, push, set, onValue, remove, update } from "./firebase";
import { motion } from "framer-motion";

export default function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });
  const [editId, setEditId] = useState(null);

  // 🧭 Fetch all products in real-time
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));
        setProducts(productList);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ➕ Add Product
  const handleAdd = () => {
    if (!newProduct.name || !newProduct.stock || !newProduct.price) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const productToAdd = {
      ...newProduct,
      stock: Number(newProduct.stock),
      price: Number(newProduct.price),
    };

    const productsRef = ref(db, "products");
    const newRef = push(productsRef);
    set(newRef, productToAdd);

    setNewProduct({ name: "", category: "", stock: "", price: "" });
  };

  // 🗑 Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      remove(ref(db, "products/" + id));
    }
  };

  // ✏️ Enable Edit
  const handleEdit = (product) => {
    setEditId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
    });
  };

  // 💾 Save Edited Product
  const handleSave = () => {
    if (!editId) return;
    const productRef = ref(db, "products/" + editId);
    update(productRef, {
      ...newProduct,
      stock: Number(newProduct.stock),
      price: Number(newProduct.price),
    });
    setEditId(null);
    setNewProduct({ name: "", category: "", stock: "", price: "" });
  };

  return (
    <div className="min-h-screen bg-red-50 p-6 md:p-10">
      <header className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-red-700"
        >
          🏷️ Inventory Tracker
        </motion.h1>
        <p className="text-gray-500 mt-1">
          Real-time inventory management using Firebase
        </p>
      </header>

      {/* Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 mb-10 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          {editId ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            className="border border-gray-300 p-3 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            className="border border-gray-300 p-3 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <input
            type="number"
            min="0"
            className="border border-gray-300 p-3 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
          <input
            type="number"
            min="0"
            step="0.01"
            className="border border-gray-300 p-3 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />

          <button
            onClick={editId ? handleSave : handleAdd}
            className="w-full bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            {editId ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </motion.div>

      {/* Product Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          📋 Product Inventory
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-10 bg-red-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No products found. Add one above 🚀
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-red-800 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-red-800 uppercase">
                    Price ($)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-red-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className={`${
                      Number(p.stock) < 10
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-gray-50"
                    } transition duration-150`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500">{p.category}</td>
                    <td className="px-6 py-3 text-center">{p.stock}</td>
                    <td className="px-6 py-3 text-center">${p.price}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-gray-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
