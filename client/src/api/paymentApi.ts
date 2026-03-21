import axios from "axios";

export interface PaymentRequest {
  cardHolderName: string;
  cardNumber: string;
  amount: number;
  currency: string;
  paymentDate: string;
  cvv: string;
  orderId: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  createdAt: string;
}

export interface PaymentDetailsItem {
  payment: {
    paymentId: string;
    cardHolderName: string;
    cardNumber: string;
    amount: number;
    currency: string;
    paymentDate: string;
    cvv: string;
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

export const createPayment = async (
  payload: PaymentRequest
): Promise<PaymentResponse> => {
  const res = await axios.post("/api/payments", payload);
  return res.data;
};

export const getPaymentDetails = async (): Promise<PaymentDetailsItem[]> => {
  const res = await axios.get("/api/payments/paymentDetails");
  return res.data;
};
