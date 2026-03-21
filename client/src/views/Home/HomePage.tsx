import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
	getInventoryProductBySku,
	InventoryItem,
} from "../../api/inventoryApi";
import { createOrder } from "../../api/orderApi";
import useCurrentUser from "../../hooks/useCurrentUser";

interface OrderLine {
	product: InventoryItem;
	quantity: number;
}

function HomePage() {
	const [sku, setSku] = useState("");
	const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [orderError, setOrderError] = useState<string | null>(null);
	const [orderStatus, setOrderStatus] = useState<string | null>(null);
	const { user } = useCurrentUser();

	const searchMutation = useMutation({
		mutationFn: (skuValue: string) => getInventoryProductBySku(skuValue),
		onSuccess: (product) => {
			setSearchError(null);
			setOrderLines((prev) => {
				const existingIndex = prev.findIndex(
					(line) => line.product.id === product.id
				);

				if (existingIndex !== -1) {
					const updated = [...prev];
					updated[existingIndex] = {
						...updated[existingIndex],
						quantity: updated[existingIndex].quantity + 1,
					};
					return updated;
				}

				return [...prev, { product, quantity: 1 }];
			});
		},
		onError: (error: any) => {
			let message = "Failed to find product";

			if (error && typeof error === "object" && "data" in error) {
				const errData: any = (error as any).data;
				if (errData && typeof errData.message === "string") {
					message = errData.message;
				}
			} else if (error instanceof Error) {
				message = error.message;
			}

			setSearchError(message);
		},
	});

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		if (!sku.trim()) return;
		searchMutation.mutate(sku.trim());
	};

	const incrementLine = (productId: string) => {
		setOrderLines((prev) =>
			prev.map((line) =>
				line.product.id === productId
					? { ...line, quantity: line.quantity + 1 }
					: line
			)
		);
	};

	const decrementLine = (productId: string) => {
		setOrderLines((prev) =>
			prev
				.map((line) =>
					line.product.id === productId
						? { ...line, quantity: line.quantity - 1 }
						: line
				)
				.filter((line) => line.quantity > 0)
		);
	};

	const createOrderMutation = useMutation({
		mutationFn: async () => {
			if (!user?.email) {
				throw new Error("You must be logged in to place an order.");
			}

			const productIdsAndQuantity: Record<string, number> = {};
			orderLines.forEach((line) => {
				productIdsAndQuantity[line.product.id] = line.quantity;
			});

			const now = new Date().toISOString();

			return createOrder({
				productIdsAndQuantity,
				createdBy: user.email,
				createdAt: now,
				updatedAt: now,
			});
		},
		onSuccess: () => {
			setOrderStatus("Order created successfully.");
			setOrderError(null);
			setOrderLines([]);
		},
		onError: (error: any) => {
			let message = "Failed to create order";

			if (error && typeof error === "object" && "data" in error) {
				const errData: any = (error as any).data;
				if (errData && typeof errData.message === "string") {
					message = errData.message;
				}
			} else if (error instanceof Error) {
				message = error.message;
			}

			setOrderError(message);
			setOrderStatus(null);
		},
	});

	const handlePlaceOrder = () => {
		if (!orderLines.length || createOrderMutation.isPending) return;
		createOrderMutation.mutate();
	};

	const orderTotal = orderLines.reduce(
		(total, line) => total + line.product.price * line.quantity,
		0
	);

	return (
		<main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
			<div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

			<section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 md:px-10 lg:pt-24">
				<header className="space-y-2">
					<h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
						Point of Sale
					</h1>
					<p className="text-slate-300">
						Search products by SKU and build an order.
					</p>
				</header>

				{/* SKU search */}
				<form
					onSubmit={handleSearch}
					className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 backdrop-blur-xl sm:flex-row"
				>
					<div className="flex-1">
						<label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
							Scan / Enter SKU
						</label>
						<input
							type="text"
							value={sku}
							onChange={(e) => setSku(e.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
							placeholder="LAP-001"
						/>
					</div>

					<div className="flex items-end">
						<button
							type="submit"
							disabled={searchMutation.isPending}
							className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:ml-2"
						>
							{searchMutation.isPending ? "Searching..." : "Search & Add"}
						</button>
					</div>
				</form>

				{searchError && (
					<div className="rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">
						{searchError}
					</div>
				)}

				{orderError && (
					<div className="rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">
						{orderError}
					</div>
				)}

				{orderStatus && (
					<div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
						{orderStatus}
					</div>
				)}

				{/* Order table */}
				<section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 backdrop-blur-xl">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-white">Current Order</h2>
						<p className="text-sm text-slate-300">
							{orderLines.length} item{orderLines.length !== 1 ? "s" : ""} in
							order
						</p>
					</div>

					{orderLines.length === 0 ? (
						<p className="text-sm text-slate-400">
							No items in the order yet. Search by SKU and add products.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full text-left text-sm text-slate-100">
								<thead className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
									<tr>
										<th className="px-3 py-2">Product</th>
										<th className="px-3 py-2">SKU</th>
										<th className="px-3 py-2 text-right">Price</th>
										<th className="px-3 py-2 text-center">Qty</th>
										<th className="px-3 py-2 text-right">Subtotal</th>
										<th className="px-3 py-2 text-center">Actions</th>
									</tr>
								</thead>
								<tbody>
									{orderLines.map((line) => (
										<tr
											key={line.product.id}
											className="border-b border-slate-800 last:border-0"
										>
											<td className="px-3 py-2">
												<div className="font-medium text-white">
													{line.product.name}
												</div>
												<div className="text-xs text-slate-400">
													{line.product.category}
												</div>
											</td>
											<td className="px-3 py-2 text-sm text-slate-300">
												{line.product.sku}
											</td>
											<td className="px-3 py-2 text-right text-sm">
												${line.product.price.toFixed(2)}
											</td>
											<td className="px-3 py-2 text-center text-sm">
												{line.quantity}
											</td>
											<td className="px-3 py-2 text-right text-sm">
												${(line.product.price * line.quantity).toFixed(2)}
											</td>
											<td className="px-3 py-2 text-center">
												<div className="inline-flex items-center gap-2">
													<button
														type="button"
														onClick={() => decrementLine(line.product.id)}
														className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-sm font-bold text-slate-100 hover:bg-slate-800"
													>
														-
													</button>
													<button
														type="button"
														onClick={() => incrementLine(line.product.id)}
														className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-slate-950 shadow-sm hover:bg-cyan-400"
													>
														+
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="text-sm text-slate-400">
							Total items: {orderLines.reduce((sum, l) => sum + l.quantity, 0)}
						</div>
						<div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-4">
							<div className="text-right">
								<p className="text-xs uppercase tracking-wide text-slate-400">
									Order Total
								</p>
								<p className="text-2xl font-bold text-emerald-400">
									${orderTotal.toFixed(2)}
								</p>
							</div>
							<button
								type="button"
								disabled={
									!orderLines.length || createOrderMutation.isPending
								}
								onClick={handlePlaceOrder}
								className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
							>
								{createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
							</button>
						</div>
					</div>
				</section>
			</section>
		</main>
	);
}

export default HomePage;

