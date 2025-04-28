
export interface Operation {
  id: string;
  name: string;
  operationId: string;
  amountPerPiece: number;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  productId: string;
  designNo: string;
  color: string;
  patternImageUrl: string;
  materialCost: number;
  threadCost: number;
  otherCosts: number;
  operations: Operation[];
  createdBy: string;
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  productId: string;
  designNo: string;
  color: string;
  patternImage: File | null;
  materialCost: number;
  threadCost: number;
  otherCosts: number;
}

export interface OperationFormData {
  name: string;
  operationId: string;
  amountPerPiece: number;
}
