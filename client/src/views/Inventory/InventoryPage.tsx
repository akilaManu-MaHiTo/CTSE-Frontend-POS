import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InventoryItem,
  getInventoryProduct,
  deleteInventoryProduct,
} from "../../api/inventoryApi";
import AddOrEditProductDialog from "./AddOrEditProductDialog";

function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<InventoryItem | null>(null);

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: getInventoryProduct,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

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
    const message =
      error instanceof Error ? error.message : "Failed to fetch inventory";

    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-6">
            <p className="text-red-100">Error: {message}</p>
          </div>
        </section>
      </main>
    );
  }

  const items = products ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Inventory
            </h1>
            <p className="text-slate-300">
              {items.length} product{items.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <button
            type="button"
            onClick={() => {setIsDialogOpen(true)
                setProductDetails(null)
            }}
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
         >
            <span className="mr-2 text-base">+</span>
            Add product
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-12 text-center">
            <p className="text-slate-300">No products found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <article
                key={product.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 backdrop-blur-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {product.name}
                      </h2>
                      <p className="text-xs text-slate-400">SKU: {product.sku}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {product.category}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm text-slate-300">
                    {product.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Price
                      </p>
                      <p className="text-lg font-semibold text-emerald-300">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Quantity
                      </p>
                      <p className="text-base font-semibold text-slate-100">
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProductDetails(product);
                      setIsDialogOpen(true);
                    }}
                    className="rounded-full border border-slate-600 bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (deleteMutation.isPending) return;
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${product.name}?`
                        )
                      ) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                    className="rounded-full bg-red-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <AddOrEditProductDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={productDetails}
        />
      </section>
    </main>
  );
}

export default InventoryPage;
