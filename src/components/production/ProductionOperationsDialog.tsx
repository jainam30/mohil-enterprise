import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Worker } from "@/types/worker";
import { Production } from "@/types/production";

interface ProductionOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  production: Production | null;
  availableWorkers: Worker[];
  onAssignWorker: (
    productionId: string,
    operationId: string,
    workerId: string,
    quantity: number
  ) => void;
}

const ProductionOperationsDialog: React.FC<ProductionOperationsDialogProps> = ({
  open,
  onOpenChange,
  production,
  availableWorkers,
  onAssignWorker,
}) => {
  const [workerId, setWorkerId] = useState("");
  const [operationId, setOperationId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);

  if (!production) return null;

  const handleSubmit = () => {
    if (!workerId || !operationId || quantity <= 0) return;

    onAssignWorker(production.id, operationId, workerId, quantity);
    setWorkerId("");
    setOperationId("");
    setQuantity(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Assign Worker to Operation</DialogTitle>
      </DialogHeader>

      <DialogContent className="space-y-6">
        {/* Select Worker */}
        <div>
          <label className="block mb-2 font-medium">Select Worker</label>
          <Select value={workerId} onValueChange={setWorkerId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose worker" />
            </SelectTrigger>
            <SelectContent>
              {availableWorkers.length === 0 && (
                <SelectItem value="none">No workers available</SelectItem>
              )}
              {availableWorkers.map((worker) => (
                <SelectItem key={worker.id} value={worker.id}>
                  {worker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Operation */}
        <div>
          <label className="block mb-2 font-medium">Select Operation</label>
          <Select value={operationId} onValueChange={setOperationId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose operation" />
            </SelectTrigger>
            <SelectContent>
              {production.operations.map((op) => (
                <SelectItem key={op.id} value={op.id}>
                  {op.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block mb-2 font-medium">Quantity (per piece)</label>
          <Input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      
        
        <Button onClick={handleSubmit}>Add</Button>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionOperationsDialog;
