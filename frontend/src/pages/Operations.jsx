import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Check,
  Loader2,
  History,
  Calendar,
  MapPin,
  Plus,
  AlertTriangle,
  X,
  Package,
  Sparkles,
  TrendingUp,
  Box,
  Warehouse,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import clsx from 'clsx';

const Operations = () => {
  const [activeTab, setActiveTab] = useState("receipt");
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [moveHistory, setMoveHistory] = useState([]);
  const [error, setError] = useState(null);

  // Form states
  const [receiptForm, setReceiptForm] = useState({
    supplier: "",
    items: [{ productId: "", quantity: "", locationId: "" }],
  });

  const [deliveryForm, setDeliveryForm] = useState({
    customer: "",
    items: [{ productId: "", quantity: "", locationId: "" }],
  });

  const [transferForm, setTransferForm] = useState({
    items: [{ productId: "", quantity: "", fromLocationId: "", toLocationId: "" }],
  });

  const [adjustmentForm, setAdjustmentForm] = useState({
    reason: "",
    items: [{ productId: "", locationId: "", newQuantity: "" }],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, locationsRes, historyRes] = await Promise.all([
        api.get("/products"),
        api.get("/ops/locations"),
        api.get("/ops/history"),
      ]);
      setProducts(productsRes.data);
      setLocations(locationsRes.data);
      setMoveHistory(historyRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data. Check backend.");
    }
    setLoading(false);
  };

  // Helper function to get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    return product ? product.name : `Product #${productId}`;
  };

  // Helper function to get location name by ID
  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === parseInt(locationId));
    return location ? location.name : `Location #${locationId}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = (formType) => {
    if (formType === "receipt") {
      setReceiptForm({
        ...receiptForm,
        items: [...receiptForm.items, { productId: "", quantity: "", locationId: "" }],
      });
    } else if (formType === "delivery") {
      setDeliveryForm({
        ...deliveryForm,
        items: [...deliveryForm.items, { productId: "", quantity: "", locationId: "" }],
      });
    } else if (formType === "transfer") {
      setTransferForm({
        ...transferForm,
        items: [...transferForm.items, { productId: "", quantity: "", fromLocationId: "", toLocationId: "" }],
      });
    } else if (formType === "adjustment") {
      setAdjustmentForm({
        ...adjustmentForm,
        items: [...adjustmentForm.items, { productId: "", locationId: "", newQuantity: "" }],
      });
    }
  };

  const handleItemChange = (formType, index, field, value) => {
    const formMap = {
      receipt: receiptForm,
      delivery: deliveryForm,
      transfer: transferForm,
      adjustment: adjustmentForm,
    };

    const formSetter = {
      receipt: setReceiptForm,
      delivery: setDeliveryForm,
      transfer: setTransferForm,
      adjustment: setAdjustmentForm,
    };

    const form = formMap[formType];
    const newItems = [...form.items];
    newItems[index][field] = value;
    formSetter[formType]({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let endpoint = "";
      let payload = {};

      if (activeTab === "receipt") {
        endpoint = "/ops/receipts";
        payload = receiptForm;
      } else if (activeTab === "delivery") {
        endpoint = "/ops/deliveries";
        payload = deliveryForm;
      } else if (activeTab === "transfer") {
        endpoint = "/ops/transfers";
        payload = transferForm;
      } else if (activeTab === "adjustment") {
        endpoint = "/ops/adjustments";
        payload = {
          reason: adjustmentForm.reason,
          productId: adjustmentForm.items[0].productId,
          locationId: adjustmentForm.items[0].locationId,
          countedQuantity: adjustmentForm.items[0].newQuantity,
        };
      }

      await api.post(endpoint, payload);
      setSuccessMessage("Operation completed successfully");

      // reset
      setReceiptForm({ supplier: "", items: [{ productId: "", quantity: "", locationId: "" }] });
      setDeliveryForm({ customer: "", items: [{ productId: "", quantity: "", locationId: "" }] });
      setTransferForm({ items: [{ productId: "", quantity: "", fromLocationId: "", toLocationId: "" }] });
      setAdjustmentForm({ reason: "", items: [{ productId: "", locationId: "", newQuantity: "" }] });

      const historyRes = await api.get("/ops/history");
      setMoveHistory(historyRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Operation failed");
    }

    setIsSubmitting(false);
  };

  const tabs = [
    { id: "receipt", label: "Stock In", icon: ArrowDownLeft, color: "from-emerald-500/20 to-teal-500/20", activeColor: "from-emerald-600 to-teal-600" },
    { id: "delivery", label: "Stock Out", icon: ArrowUpRight, color: "from-rose-500/20 to-pink-500/20", activeColor: "from-rose-600 to-pink-600" },
    { id: "transfer", label: "Transfer", icon: ArrowRightLeft, color: "from-blue-500/20 to-cyan-500/20", activeColor: "from-blue-600 to-cyan-600" },
    { id: "adjustment", label: "Adjustment", icon: AlertTriangle, color: "from-amber-500/20 to-orange-500/20", activeColor: "from-amber-600 to-orange-600" },
    { id: "history", label: "History", icon: History, color: "from-purple-500/20 to-indigo-500/20", activeColor: "from-purple-600 to-indigo-600" },
  ];

  const getTabConfig = (tabId) => {
    return tabs.find(t => t.id === tabId) || tabs[0];
  };

  const handleRemoveItem = (formType, index) => {
    const formMap = {
      receipt: receiptForm,
      delivery: deliveryForm,
      transfer: transferForm,
      adjustment: adjustmentForm,
    };

    const formSetter = {
      receipt: setReceiptForm,
      delivery: setDeliveryForm,
      transfer: setTransferForm,
      adjustment: setAdjustmentForm,
    };

    const form = formMap[formType];
    const newItems = form.items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      // Keep at least one item
      if (formType === "receipt") {
        setReceiptForm({ ...form, items: [{ productId: "", quantity: "", locationId: "" }] });
      } else if (formType === "delivery") {
        setDeliveryForm({ ...form, items: [{ productId: "", quantity: "", locationId: "" }] });
      } else if (formType === "transfer") {
        setTransferForm({ ...form, items: [{ productId: "", quantity: "", fromLocationId: "", toLocationId: "" }] });
      } else if (formType === "adjustment") {
        setAdjustmentForm({ ...form, items: [{ productId: "", locationId: "", newQuantity: "" }] });
      }
    } else {
      formSetter[formType]({ ...form, items: newItems });
    }
  };

  return (
    <Layout>
      <div className="space-y-8 pb-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3),transparent_50%)] opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                <ArrowRightLeft className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Operations
                </h1>
                <p className="text-slate-400 mt-1">Manage stock movements and inventory operations</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative overflow-hidden px-6 py-3.5 rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300",
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.activeColor} text-white shadow-lg shadow-${tab.activeColor.split(' ')[1]}/30`
                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={`w-5 h-5 relative z-10 ${activeTab === tab.id ? 'text-white' : ''}`} />
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4 text-white opacity-60" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "history" ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <History className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Movement History</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">From</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">To</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                          </td>
                        </tr>
                      ) : moveHistory.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <History className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-slate-400">No movement history found</p>
                          </td>
                        </tr>
                      ) : (
                        moveHistory.map((m, index) => (
                          <motion.tr
                            key={m.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-300">{new Date(m.createdAt).toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                m.type === 'receipt' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                m.type === 'delivery' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                m.type === 'transfer' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {m.type === 'receipt' && <ArrowDownLeft className="w-3 h-3" />}
                                {m.type === 'delivery' && <ArrowUpRight className="w-3 h-3" />}
                                {m.type === 'transfer' && <ArrowRightLeft className="w-3 h-3" />}
                                {m.type === 'adjustment' && <AlertTriangle className="w-3 h-3" />}
                                {m.type?.charAt(0).toUpperCase() + m.type?.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-white font-medium">{getProductName(m.productId)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-white">{m.quantity}</span>
                            </td>
                            <td className="px-6 py-4">
                              {m.fromLocationId ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-300">{getLocationName(m.fromLocationId)}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {m.toLocationId ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-300">{getLocationName(m.toLocationId)}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-500">-</span>
                              )}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
            >
              <div className="p-8">
                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <p className="text-emerald-300 font-medium">{successMessage}</p>
                      <button
                        onClick={() => setSuccessMessage("")}
                        className="ml-auto p-1 hover:bg-emerald-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-emerald-400" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center gap-3"
                    >
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <p className="text-rose-300 font-medium">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="ml-auto p-1 hover:bg-rose-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-rose-400" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTabConfig(activeTab).color} border border-white/10`}>
                    {React.createElement(getTabConfig(activeTab).icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{getTabConfig(activeTab).label}</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {activeTab === "receipt" && "Record incoming stock from suppliers"}
                      {activeTab === "delivery" && "Process outgoing stock to customers"}
                      {activeTab === "transfer" && "Move stock between locations"}
                      {activeTab === "adjustment" && "Adjust stock quantities and corrections"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Additional Fields for Receipt/Delivery */}
                  {(activeTab === "receipt" || activeTab === "delivery") && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        {activeTab === "receipt" ? (
                          <>
                            <Warehouse className="w-4 h-4 text-indigo-400" />
                            Supplier Name
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 text-indigo-400" />
                            Customer Name
                          </>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        value={activeTab === "receipt" ? receiptForm.supplier : deliveryForm.customer}
                        onChange={(e) => {
                          if (activeTab === "receipt") {
                            setReceiptForm({ ...receiptForm, supplier: e.target.value });
                          } else {
                            setDeliveryForm({ ...deliveryForm, customer: e.target.value });
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder={activeTab === "receipt" ? "Enter supplier name" : "Enter customer name"}
                      />
                    </div>
                  )}

                  {/* Adjustment Reason */}
                  {activeTab === "adjustment" && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Reason for Adjustment
                      </label>
                      <input
                        type="text"
                        required
                        value={adjustmentForm.reason}
                        onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                        placeholder="e.g. Damaged goods, Inventory count discrepancy"
                      />
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-indigo-400" />
                        Items
                      </h3>
                    </div>

                    {(activeTab === "receipt"
                      ? receiptForm.items
                      : activeTab === "delivery"
                      ? deliveryForm.items
                      : activeTab === "transfer"
                      ? transferForm.items
                      : adjustmentForm.items
                    ).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all"
                      >
                        {((activeTab === "receipt" ? receiptForm.items : activeTab === "delivery" ? deliveryForm.items : activeTab === "transfer" ? transferForm.items : adjustmentForm.items).length > 1) && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(activeTab, index)}
                            className="absolute top-4 right-4 p-2 hover:bg-rose-500/20 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                          {/* PRODUCT */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                              <Package className="w-4 h-4 text-indigo-400" />
                              Product
                            </label>
                            <select
                              required
                              value={item.productId}
                              onChange={(e) => handleItemChange(activeTab, index, "productId", e.target.value)}
                              className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk0YTNiZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px_8px]"
                            >
                              <option value="" className="bg-slate-800">Select product</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id} className="bg-slate-800">
                                  {p.name} ({p.sku})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* QTY */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-indigo-400" />
                              Quantity
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={item.quantity || item.newQuantity || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  activeTab,
                                  index,
                                  activeTab === "adjustment" ? "newQuantity" : "quantity",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                              placeholder="0"
                            />
                          </div>

                          {/* LOCATION FIELDS */}
                          {activeTab === "transfer" ? (
                            <>
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-rose-400" />
                                  From Location
                                </label>
                                <select
                                  required
                                  value={item.fromLocationId}
                                  onChange={(e) => handleItemChange(activeTab, index, "fromLocationId", e.target.value)}
                                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk0YTNiZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px_8px]"
                                >
                                  <option value="" className="bg-slate-800">Select Location</option>
                                  {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id} className="bg-slate-800">
                                      {loc.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-emerald-400" />
                                  To Location
                                </label>
                                <select
                                  required
                                  value={item.toLocationId}
                                  onChange={(e) => handleItemChange(activeTab, index, "toLocationId", e.target.value)}
                                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk0YTNiZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px_8px]"
                                >
                                  <option value="" className="bg-slate-800">Select Location</option>
                                  {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id} className="bg-slate-800">
                                      {loc.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                Location
                              </label>
                              <select
                                required
                                value={item.locationId}
                                onChange={(e) => handleItemChange(activeTab, index, "locationId", e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk0YTNiZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px_8px]"
                              >
                                <option value="" className="bg-slate-800">Select Location</option>
                                {locations.map((loc) => (
                                  <option key={loc.id} value={loc.id} className="bg-slate-800">
                                    {loc.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add Item Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddItem(activeTab)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Add Item
                  </motion.button>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r ${getTabConfig(activeTab).activeColor} text-white font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                    style={{
                      boxShadow: isSubmitting ? undefined : `0 10px 40px -10px ${getTabConfig(activeTab).activeColor.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' : getTabConfig(activeTab).activeColor.includes('rose') ? 'rgba(244, 63, 94, 0.3)' : getTabConfig(activeTab).activeColor.includes('blue') ? 'rgba(37, 99, 235, 0.3)' : getTabConfig(activeTab).activeColor.includes('amber') ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                        <span className="relative z-10">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Submit {getTabConfig(activeTab).label}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Operations;
