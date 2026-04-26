import { useQuery } from "@tanstack/react-query";
import { getCustomerDetails, CustomerDetailsItem } from "../api/customerApi";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CustomerDetailsPage = () => {
  const {
    data: customerDetails,
    isLoading,
    isError,
    error,
  } = useQuery<CustomerDetailsItem[], Error>({
    queryKey: ["customerDetails"],
    queryFn: getCustomerDetails,
  });

  const visibleCustomerDetails = customerDetails?.filter(
    (item) => item.customer !== null
  );
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
            <p className="text-red-100">Error: {error?.message || "Failed to fetch customer details"}</p>
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
            Customer Payments
          </h1>
          <p className="text-slate-300">
            {visibleCustomerDetails?.length || 0} record{visibleCustomerDetails && visibleCustomerDetails.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {(!visibleCustomerDetails || visibleCustomerDetails.length === 0) ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-12 text-center">
            <p className="text-slate-300">No customer payment records found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleCustomerDetails.map((item, index) => (
              <div
                key={`${item.payment.paymentId}-${index}`}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Customer section */}
                <div className="border-b border-white/10 bg-slate-900/40 p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Customer
                    </p>
                    {item.customer ? (
                      <div className="mt-1 space-y-1 text-sm text-slate-200">
                        <p className="font-semibold">{item.customer.name || "(No name)"}</p>
                        <p>Email: {item.customer.email}</p>
                        <p>Mobile: {item.customer.mobile}</p>
                        <p>Loyalty Points: {item.customer.loyaltyPoints}</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-slate-300">No customer linked</p>
                    )}
                  </div>
                  <div>
                    {item.customer ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                        Loyalty Payment
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
                        Not Loyalty Payment
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment header */}
                <div className="border-b border-white/10 bg-linear-to-r from-cyan-500/10 to-transparent p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Payment ID
                      </p>
                      <p className="mt-1 font-semibold text-cyan-200">
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
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CustomerDetailsPage;
