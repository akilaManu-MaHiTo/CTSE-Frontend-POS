import axios from "axios";

export interface CreateCustomerRequest {
  name?: string;
  email?: string;
  mobile: string;
  loyaltyPoints: number;
  paymentIds: string[];
}

export interface CustomerResponse {
  id: string;
  name?: string;
  email?: string;
  mobile: string;
  loyaltyPoints: number;
  paymentIds: string[];
  createdAt: string;
}

export interface CustomerDetailsItem {
  customer: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    loyaltyPoints: number;
  } | null;
  payment: {
    paymentId: string;
    cardHolderName: string;
    cardNumber: string;
    amount: number;
    currency: string;
    paymentDate: string;
    orderId: string;
  };
  order: {
    id: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    items: {
      productId: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        availableQuantity: number;
        sku: string;
      };
    }[];
  };
}

export const createCustomer = async (
  payload: CreateCustomerRequest
): Promise<CustomerResponse> => {
  const res = await axios.post("/api/customer", payload);
  return res.data;
};

export const getCustomerDetails = async (): Promise<CustomerDetailsItem[]> => {
  const res = await axios.get("/api/customer/payment-order-product-details");
  return res.data;
};
