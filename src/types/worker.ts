
export interface Worker {
  id: string;
  name: string;
  workerId: string;
  address: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  bankAccountDetail: string;
  bankImageUrl: string;
  createdBy: string;
  createdAt: Date;
}

export interface WorkerFormData {
  name: string;
  workerId: string;
  address: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  bankAccountDetail: string;
  bankImage: File | null;
}
