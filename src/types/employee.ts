
export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  address: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  bankAccountDetail: string;
  bankImageUrl: string;
  salary: number;
  createdBy: string;
  createdAt: Date;
}

export interface EmployeeFormData {
  name: string;
  employeeId: string;
  address: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  bankAccountDetail: string;
  bankImage: File | null;
  salary: number;
}
