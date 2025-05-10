export interface ProductionCutting {
  id: string;
  productId: string;
  totalPieces: number;
  cutDate: Date;
  createdBy: string;
}

export interface ProductionOperation {
  id: string;
  productionId: string;
  operationId: string;
  workerId: string;
  workerName?: string; // Added worker name for display purposes
  piecesDone: number;
  date: Date;
  createdBy: string;
}

export interface ProductionProgress {
  operationName: string;
  totalPieces: number;
  completedPieces: number;
  percentage: number;
}

export interface ProductionStatus {
  productId: string;
  productName: string;
  totalPieces: number;
  completedPieces: number;
  percentage: number;
  operationsProgress: ProductionProgress[];
}

export interface WorkerProductionEntry {
  productId: string;
  workerId: string;
  operationId: string;
  piecesDone: number;
}

export interface Production {
  id: string;
  name: string;
  productionId: string;
  poNumber: string;
  color: string;
  totalFabric: number;
  average: number;
  totalQuantity: number;
  operations: ProductionOperationDetail[];
  createdBy: string;
  createdAt: Date;
}

export interface ProductionOperationDetail {
  id: string;
  name: string;
  ratePerPiece: number;
  isCompleted: boolean;
  productionId: string;
  assignedWorkerId?: string; // Added field to track assigned worker
  assignedWorkerName?: string; // Added field to display worker name
}

export interface ProductionFormData {
  name: string;
  productionId: string;
  poNumber: string;
  color: string;
  totalFabric: number;
  average: number;
  totalQuantity: number;
  operations: {
    name: string;
    ratePerPiece: number;
  }[];
}

export interface ProductionReport {
  daily: ReportData;
  weekly: ReportData;
  monthly: ReportData;
  yearly: ReportData;
}

export interface ReportData {
  productionQuantity: number;
  operationExpense: number;
  rawMaterialCost: number;
  totalExpense: number;
  efficiency: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  totalPiecesCompleted: number;
  totalOperations: number;
  efficiency: number;
  earnings: number;
}

// New interface for worker assignment
export interface WorkerAssignment {
  workerId: string;
  workerName: string;
  operationId: string;
  operationName: string;
  productionId: string;
  productionName: string;
  piecesDone: number;
  date: Date;
}
