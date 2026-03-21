import axios from "axios";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  sku: string;
}

export const getInventoryProduct = async (): Promise<InventoryItem[]> => {
  const res = await axios.get(`/api/inventory`);
  return res.data;
};

export const getInventoryProductBySku = async (
  sku: string
): Promise<InventoryItem> => {
  const res = await axios.get(`/api/inventory/sku/${encodeURIComponent(sku)}`);
  return res.data;
};

export type InventoryItemInput = Omit<InventoryItem, "id">;

export const createInventoryProduct = async (
  payload: InventoryItemInput
): Promise<InventoryItem> => {
  const res = await axios.post(`/api/inventory`, payload);
  return res.data;
};

export const updateInventoryProduct = async (
  id: string,
  payload: InventoryItemInput
): Promise<InventoryItem> => {
  const res = await axios.put(`/api/inventory/${id}`, payload);
  return res.data;
};

export const deleteInventoryProduct = async (id: string): Promise<void> => {
  await axios.delete(`/api/inventory/${id}`);
};