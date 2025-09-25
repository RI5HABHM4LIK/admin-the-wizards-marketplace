"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders", { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleDelivered = async (orderId, current) => {
    try {
      await api.put(`/orders/${orderId}/deliver`, {
        isDelivered: !current,
      });
      toast.success(
        `Order marked as ${!current ? "Delivered" : "Not Delivered"}`
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, isDelivered: !current } : o
        )
      );
    } catch (err) {
      toast.error("Failed to update delivery status");
    }
  };

  const togglePaid = async (orderId, current) => {
    try {
      await api.put(`/orders/${orderId}/pay`, {
        isPaid: !current,
      });
      toast.success(`Order marked as ${!current ? "Paid" : "Not Paid"}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isPaid: !current } : o))
      );
    } catch (err) {
      toast.error("Failed to update payment status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {format(new Date(order.createdAt), "PPP p")}
                  </p>
                </div>
                <div className="flex gap-3">
                  {order.isDelivered ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle size={16} /> Delivered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 text-sm">
                      <Package size={16} /> Processing
                    </span>
                  )}
                  {order.isPaid ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle size={16} /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <XCircle size={16} /> Not Paid
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-2">Items</h3>
                  <div className="divide-y">
                    {order.orderItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <p>
                            {item.qty} × ${item.price}
                          </p>
                          <p className="font-semibold">
                            ${item.qty * item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-3 text-sm space-y-1">
                  <p>Items: ${order.itemsPrice}</p>
                  <p>Shipping: ${order.shippingPrice}</p>
                  <p className="font-bold">Total: ${order.totalPrice}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() =>
                      toggleDelivered(order._id, order.isDelivered)
                    }
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      order.isDelivered
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <Truck size={16} />
                    {order.isDelivered ? "Mark Undelivered" : "Mark Delivered"}
                  </button>

                  <button
                    onClick={() => togglePaid(order._id, order.isPaid)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      order.isPaid
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <DollarSign size={16} />
                    {order.isPaid ? "Mark Unpaid" : "Mark Paid"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
