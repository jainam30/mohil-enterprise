// src/components/production/ProductionOperationsDialog.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Worker } from "@/types/worker";
import { Production } from "@/types/production";
import { getOperationsByProductionId, assignWorkerToOperation } from "@/Services/productionService";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  production: Production | null;
  availableWorkers: Worker[];
  onAssignWorker?: (productionId: string, operationRecordId: string, workerId: string, pieces: number) => void;
}

const ProductionOperationsDialog: React.FC<Props> = ({ open, onOpenChange, production, availableWorkers, onAssignWorker }) => {
  const { toast } = useToast();
  const [ops, setOps] = useState<any[]>([]);
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null); // id of production_operation row
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [pieces, setPieces] = useState<number>(0);

  useEffect(() => {
    if (!production) {
      setOps([]);
      return;
    }
    (async () => {
      try {
        const data = await getOperationsByProductionId(production.id);
        setOps(data || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load operations", variant: "destructive" });
      }
    })();
  }, [production]);

  const handleAdd = async () => {
    if (!production || !selectedOpId) {
      toast({ title: "Select operation", variant: "destructive" });
      return;
    }

    try {
      // Find worker name if available
      const worker = availableWorkers.find(w => w.id === selectedWorkerId);
      const workerName = worker ? worker.name : null;

      const res = await assignWorkerToOperation(production.id, selectedOpId, selectedWorkerId || null, pieces || 0, workerName || null);
      toast({ title: "Assigned", description: "Worker and quantity saved" });

      // refresh ops list
      const refreshed = await getOperationsByProductionId(production.id);
      setOps(refreshed || []);

      // callback to parent
      onAssignWorker && onAssignWorker(production.id, selectedOpId, selectedWorkerId || "", pieces || 0);
      // clear selections
      setSelectedOpId(null);
      setSelectedWorkerId(null);
      setPieces(0);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message || "Failed to assign", variant: "destructive" });
    }
  };

  if (!production) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Assign Worker / Record Pieces</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Operation</label>
            <Select value={selectedOpId ?? ""} onValueChange={(v) => setSelectedOpId(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose operation (production operation record)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- select --</SelectItem>
                {ops.map(op => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.operations?.name ?? op.operation_id ?? "Operation"} — Pieces done: {op.pieces_done}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Worker</label>
            <Select value={selectedWorkerId ?? ""} onValueChange={(v) => setSelectedWorkerId(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select worker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">none</SelectItem>
                {availableWorkers.map(w => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity (pieces)</label>
            <input
              type="number"
              value={pieces}
              onChange={(e) => setPieces(Number(e.target.value))}
              className="w-full border rounded px-2 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={handleAdd}>Add / Save</Button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Existing Operation Records</h4>
            <div className="mt-2 space-y-2">
              {ops.map(o => (
                <div key={o.id} className="border rounded p-2">
                  <div className="text-sm font-medium">{o.operations?.name ?? o.operation_id}</div>
                  <div className="text-xs text-muted-foreground">
                    Worker: {o.worker_name ?? "none"} · Pieces: {o.pieces_done} · Date: {o.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ProductionOperationsDialog;
