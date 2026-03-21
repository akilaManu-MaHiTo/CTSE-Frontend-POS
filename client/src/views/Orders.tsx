import { useEffect, useState } from "react";
import { getOrderDetails, Order } from "../api/orderApi";
import { createPayment, PaymentRequest } from "../api/paymentApi";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<Order | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    cardHolderName: string;
    cardNumber: string;
    cvv: string;
  } | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderTotal = (order: Order) => {
    return order.items
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  const openPaymentForm = (order: Order) => {
    setSelectedOrderForPayment(order);
    setPaymentError(null);
    setPaymentSuccess(null);
    setPaymentForm({
      cardHolderName: "",
      cardNumber: "",
      cvv: "",
    });
  };

  const closePaymentForm = () => {
    setSelectedOrderForPayment(null);
    setPaymentForm(null);
    setIsSubmittingPayment(false);
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrderForPayment || !paymentForm) return;

    try {
      setIsSubmittingPayment(true);
      setPaymentError(null);

      const payload: PaymentRequest = {
        cardHolderName: paymentForm.cardHolderName,
        cardNumber: paymentForm.cardNumber,
        cvv: paymentForm.cvv,
        amount: Number(calculateOrderTotal(selectedOrderForPayment)),
        currency: "USD",
        paymentDate: new Date().toISOString(),
        orderId: selectedOrderForPayment.id,
      };

      await createPayment(payload);
      setPaymentSuccess("Payment created successfully");
      // Optionally close the form after success
      // closePaymentForm();
    } catch (err) {
      console.error("Error creating payment:", err);
      setPaymentError("Failed to create payment. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-6">
            <p className="text-red-100">Error: {error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Order Details
          </h1>
          <p className="text-slate-300">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-12 text-center">
            <p className="text-slate-300">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Order Header */}
                <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>
                      <p className="mt-1 font-semibold text-cyan-200">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Created By
                      </p>
                      <p className="mt-1 font-semibold text-slate-100">
                        {order.createdBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order Date
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order Total
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-400">
                        ${calculateOrderTotal(order)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="mb-4 font-semibold text-slate-100">
                    Items ({order.items.length})
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-700 bg-slate-900/40 p-4"
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Product
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Category
                            </p>
                            <p className="mt-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                              {item.product.category}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Price
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Quantity
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              {item.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Available Stock
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-400">
                              {item.product.availableQuantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Subtotal
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              $
                              {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-wider text-slate-400">
                            Description
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            {item.product.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="border-t border-white/10 bg-slate-900/30 px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-slate-400">
                    Last updated: {formatDate(order.updatedAt)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openPaymentForm(order)}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrderForPayment && paymentForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white">
                Pay for Order {selectedOrderForPayment.id}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Amount: ${calculateOrderTotal(selectedOrderForPayment)} USD
              </p>

              {paymentError && (
                <div className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {paymentError}
                </div>
              )}

              {paymentSuccess && (
                <div className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                  {paymentSuccess}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    value={paymentForm.cardHolderName}
                    onChange={(e) =>
                      setPaymentForm((prev) =>
                        prev
                          ? { ...prev, cardHolderName: e.target.value }
                          : prev
                      )
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    value={paymentForm.cardNumber}
                    onChange={(e) =>
                      setPaymentForm((prev) =>
                        prev
                          ? { ...prev, cardNumber: e.target.value }
                          : prev
                      )
                    }
                    placeholder="4111 1111 1111 1111"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                      CVV
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      value={paymentForm.cvv}
                      onChange={(e) =>
                        setPaymentForm((prev) =>
                          prev ? { ...prev, cvv: e.target.value } : prev
                        )
                      }
                      placeholder="123"
                    />
                  </div>
                  <div className="flex flex-col justify-end text-sm text-slate-300">
                    <span>Currency: USD</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closePaymentForm}
                  className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                  disabled={isSubmittingPayment}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={isSubmittingPayment}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingPayment ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;
