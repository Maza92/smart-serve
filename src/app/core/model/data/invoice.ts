export interface InvoiceDto {
  restaurantName: string;
  restaurantAddress: string;
  restaurantTaxId: string;
  invoiceNumber: string;
  issuedAt: Date;
  orderId: number;
  customerName: string;
  tableNumber: number;
  waiterName: string;
  guestsCount: number;
  details: InvoiceDetailDto[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
}

export interface InvoiceDetailDto {
  dishName: string;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
}
