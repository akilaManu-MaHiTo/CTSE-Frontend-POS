import axios from "axios";

export interface Product {
  availableQuantity: number;
  category: string;
  description: string;
  id: string;
  name: string;
  price: number;
  sku: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  items: OrderItem[];
  createdAt: string;
  createdBy: string;
  id: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  productIdsAndQuantity: Record<string, number>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const getOrderDetails = async (): Promise<Order[]> => {
  const res = await axios.get(`/api/orders/orderDetails`);
  return res.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const res = await axios.get(`/api/orders/orderDetails/${orderId}`);
  return res.data;
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const res = await axios.post(`/api/orders`, payload);
  return res.data;
};
