import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPaymentDetails, PaymentDetailsItem } from "../api/paymentApi";
import { createCustomer, CreateCustomerRequest } from "../api/customerApi";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PaymentsPage = () => {
  const {
    data: payments,
    isLoading,
    isError,
    error,
  } = useQuery<PaymentDetailsItem[], Error>({
    queryKey: ["paymentDetails"],
    queryFn: getPaymentDetails,
  });

  const [selectedForCustomer, setSelectedForCustomer] =
    useState<PaymentDetailsItem | null>(null);
  const [customerForm, setCustomerForm] = useState<{
    name: string;
    email: string;
    mobile: string;
  } | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [customerSuccess, setCustomerSuccess] = useState<string | null>(null);

  const customerMutation = useMutation({
    mutationFn: (payload: CreateCustomerRequest) => createCustomer(payload),
    onSuccess: () => {
      setCustomerSuccess("Customer updated with payment successfully.");
    },
    onError: () => {
      setCustomerError("Failed to add payment to customer. Please try again.");
    },
  });

  const openCustomerForm = (item: PaymentDetailsItem) => {
    setSelectedForCustomer(item);
    setCustomerForm({ name: "", email: "", mobile: "" });
    setCustomerError(null);
    setCustomerSuccess(null);
  };

  const closeCustomerForm = () => {
    setSelectedForCustomer(null);
    setCustomerForm(null);
    setCustomerError(null);
    setCustomerSuccess(null);
    customerMutation.reset();
  };

  const handleSubmitCustomer = async () => {
    if (!selectedForCustomer || !customerForm) return;

    if (!customerForm.mobile.trim()) {
      setCustomerError("Mobile number is required.");
      setCustomerSuccess(null);
      return;
    }

    setCustomerError(null);
    setCustomerSuccess(null);

    const loyaltyPoints =
      selectedForCustomer.payment.amount > 0
        ? selectedForCustomer.payment.amount / 100
        : 0;

    const payload: CreateCustomerRequest = {
      name: customerForm.name.trim() || undefined,
      email: customerForm.email.trim() || undefined,
      mobile: customerForm.mobile.trim(),
      loyaltyPoints,
      paymentIds: [selectedForCustomer.payment.paymentId],
    };

    await customerMutation.mutateAsync(payload);
  };

  if (isLoading) {
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

  if (isError) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-6">
            <p className="text-red-100">Error: {error?.message || "Failed to fetch payment details"}</p>
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
            Payment Details
          </h1>
          <p className="text-slate-300">
            {payments?.length || 0} payment{payments && payments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {(!payments || payments.length === 0) ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-12 text-center">
            <p className="text-slate-300">No payments found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((item) => (
              <div
                key={item.payment.paymentId}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Payment header */}
                <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Payment ID
                      </p>
                      <p className="mt-1 font-semibold text-emerald-200">
                        {item.payment.paymentId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Card Holder
                      </p>
                      <p className="mt-1 font-semibold text-slate-100">
                        {item.payment.cardHolderName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Amount
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-400">
                        ${item.payment.amount.toFixed(2)} {item.payment.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Payment Date
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {formatDate(item.payment.paymentDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Linked order info */}
                <div className="border-b border-white/10 bg-slate-900/40 p-6">
                  <h3 className="mb-3 text-sm font-semibold text-slate-200">
                    Order
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>
                      <p className="mt-1 font-semibold text-cyan-200">
                        {item.order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Created By
                      </p>
                      <p className="mt-1 font-semibold text-slate-100">
                        {item.order.createdBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order Date
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {formatDate(item.order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-6">
                  <h3 className="mb-4 font-semibold text-slate-100">
                    Items ({item.order.items.length})
                  </h3>
                  <div className="space-y-4">
                    {item.order.items.map((orderItem) => (
                      <div
                        key={`${orderItem.productId}-${orderItem.product.sku}`}
                        className="rounded-xl border border-slate-700 bg-slate-900/40 p-4"
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Product
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {orderItem.product.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              SKU: {orderItem.product.sku}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Category
                            </p>
                            <p className="mt-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                              {orderItem.product.category}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Price
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              ${orderItem.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Quantity
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              {orderItem.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Available Stock
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-400">
                              {orderItem.product.availableQuantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                              Subtotal
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              ${(orderItem.product.price * orderItem.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-wider text-slate-400">
                            Description
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            {orderItem.product.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 bg-slate-900/30 px-6 py-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openCustomerForm(item)}
                    className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/40 transition hover:bg-cyan-400"
                  >
                    Add to Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedForCustomer && customerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Add Payment to Customer
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Payment ID: {selectedForCustomer.payment.paymentId}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Amount: ${selectedForCustomer.payment.amount.toFixed(2)}{" "}
              {selectedForCustomer.payment.currency}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Loyalty Points: {selectedForCustomer.payment.amount / 100}
            </p>

            {customerError && (
              <div className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
                {customerError}
              </div>
            )}

            {customerSuccess && (
              <div className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                {customerSuccess}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name (optional)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email (optional)
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                  Mobile (required)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  value={customerForm.mobile}
                  onChange={(e) =>
                    setCustomerForm((prev) =>
                      prev ? { ...prev, mobile: e.target.value } : prev
                    )
                  }
                  placeholder="0771234567"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCustomerForm}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                disabled={customerMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitCustomer}
                disabled={customerMutation.isPending}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {customerMutation.isPending ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentsPage;
