import { useState, useEffect, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInventoryProduct,
  InventoryItem,
  InventoryItemInput,
  updateInventoryProduct,
} from "../../api/inventoryApi";

interface AddOrEditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // Optional existing product for future edit support; currently only add is used.
  product?: InventoryItem | null;
}

function AddOrEditProductDialog({
  open,
  onClose,
  onSuccess,
  product,
}: AddOrEditProductDialogProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<InventoryItemInput>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    quantity: product?.quantity ?? 0,
    category: product?.category ?? "",
    sku: product?.sku ?? "",
  });

  useEffect(() => {
    setForm({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      quantity: product?.quantity ?? 0,
      category: product?.category ?? "",
      sku: product?.sku ?? "",
    });
  }, [product, open]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: InventoryItemInput) =>
      product
        ? updateInventoryProduct(product.id, payload)
        : createInventoryProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  const isEditMode = Boolean(product);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isEditMode ? "Edit product" : "Add new product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            disabled={isPending}
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Name
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Product name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                SKU
              </label>
              <input
                required
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="SKU-001"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Category
              </label>
              <input
                required
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Category"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Quantity
              </label>
              <input
                type="number"
                min={0}
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Price
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="Short description of the product"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {(error as Error).message || "Failed to save product"}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                ? "Save changes"
                : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrEditProductDialog;
