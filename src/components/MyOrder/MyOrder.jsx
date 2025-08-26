import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // fetch orders for a user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/orders", {
          params: { email: user?.email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const formattedOrders =
          response.data.map((order) => ({
            ...order,
            items:
              order.items?.map((entry) => ({
                _id: entry._id,
                item: {
                  ...entry.item,
                  imageUrl: entry.item.imageUrl,
                },
                quantity: entry.quantity,
              })) || [],
            createdAt: new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            paymentStatus: order.paymentStatus?.toLowerCase() || "pending",
          })) || [];

        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error("error fetching orders", err);
        setError(
          err.response?.data?.message ||
            "Failed to load orders. Please try again later"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const statusStyles = {
    processing: {
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      icon: <FiClock className="text-lg" />,
      label: "Processing",
    },
    outForDelivery: {
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      icon: <FiTruck className="text-lg" />,
      label: "Out for Delivery",
    },
    delivered: {
      color: "text-green-400",
      bg: "bg-green-900/20",
      icon: <FiCheckCircle className="text-lg" />,
      label: "Delivered",
    },
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      icon: <FiClock className="text-lg" />,
      label: "Payment Pending",
    },
    succeeded: {
      color: "text-green-400",
      bg: "bg-green-900/20",
      icon: <FiCheckCircle className="text-lg" />,
      label: "Completed",
    },
  };

  const getPaymentMethodDetails = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
        return {
          label: "Cash on Delivery",
          class:
            "bg-yellow-600/30 text-yellow-300 border border-yellow-500/50 px-2 py-1 rounded-lg text-sm",
        };
      case "card":
        return {
          label: "Credit/Debit Card",
          class:
            "bg-blue-600/30 text-blue-300 border border-blue-500/50 px-2 py-1 rounded-lg text-sm",
        };
      case "upi":
        return {
          label: "UPI Payment",
          class:
            "bg-purple-600/30 text-purple-300 border border-purple-500/50 px-2 py-1 rounded-lg text-sm",
        };
      default:
        return {
          label: "Online",
          class:
            "bg-green-600/30 text-green-400 border border-green-500/50 px-2 py-1 rounded-lg text-sm",
        };
    }
  };

  // error screen
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p className="text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FiArrowLeft /> <span>Try again</span>
        </button>
      </div>
    );

  // loading screen
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading your orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
          >
            <FiArrowLeft /> <span className="font-bold">Back to Home</span>
          </Link>
          <div className="text-sm text-gray-300">
            Logged in as: <span className="font-medium">{user?.email}</span>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Order History</h2>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 text-left text-amber-400">Order ID</th>
                  <th className="p-4 text-left text-amber-400">Customer</th>
                  <th className="p-4 text-left text-amber-400">Address</th>
                  <th className="p-4 text-left text-amber-400">Items</th>
                  <th className="p-4 text-left text-amber-400">Total Items</th>
                  <th className="p-4 text-left text-amber-400">Price</th>
                  <th className="p-4 text-left text-amber-400">Payment</th>
                  <th className="p-4 text-left text-amber-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const totalPrice =
                    order.total ??
                    order.items.reduce(
                      (sum, item) => sum + item.item.price * item.quantity,
                      0
                    );
                  const paymentMethod =
                    getPaymentMethodDetails(order.paymentMethod);
                  const status =
                    statusStyles[order.status] || statusStyles.processing;
                  const paymentStatus =
                    statusStyles[order.paymentStatus] || statusStyles.pending;

                  return (
                    <tr
                      key={order._id}
                      className="border-t border-gray-700 hover:bg-gray-800/50 transition"
                    >
                      <td className="p-4">#{order._id?.slice(-8)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser />
                          <div>
                            <p className="font-medium">
                              {order.firstName} {order.lastName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <FiMapPin />
                          <div className="text-sm text-gray-300">
                            {order.address}, {order.city} - {order.zipCode}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 space-y-2">
                        {order.items.map((entry, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={`http://localhost:4000${entry.item.imageUrl}`}
                              alt={entry.item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-700"
                            />
                            <div>
                              <span className="block font-medium">
                                {entry.item.name}
                              </span>
                              <div className="text-sm text-gray-400 flex gap-2">
                                <span>₹{entry.item.price}</span>
                                <span>×{entry.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiBox /> <span>{totalItems}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        ₹{totalPrice.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <span className={paymentMethod.class}>
                            {paymentMethod.label}
                          </span>
                          <span
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${paymentStatus.bg} ${paymentStatus.color}`}
                          >
                            {paymentStatus.icon}
                            {paymentStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${status.bg} ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
