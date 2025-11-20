import React, { useState, useMemo } from "react";
import { WorkerAssignment } from "@/types/production";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface WorkerAssignmentTableProps {
  assignments: WorkerAssignment[];
}

export const WorkerAssignmentTable: React.FC<WorkerAssignmentTableProps> = ({
  assignments,
}) => {
  // --- FILTER STATES ---
  const [workerFilter, setWorkerFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const [productionFilter, setProductionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Generate dropdown options dynamically
  const workers = Array.from(new Set(assignments.map((a) => a.workerName))).filter(Boolean);
  const operations = Array.from(new Set(assignments.map((a) => a.operationName))).filter(Boolean);
  const productions = Array.from(new Set(assignments.map((a) => a.productionName))).filter(Boolean);

  // --- APPLY FILTERS ---
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchesWorker = workerFilter === "all" || item.workerName === workerFilter;
      const matchesOperation = operationFilter === "all" || item.operationName === operationFilter;
      const matchesProduction = productionFilter === "all" || item.productionName === productionFilter;

      const matchesDate =
        dateFilter === "" ||
        new Date(item.date).toISOString().split("T")[0] === dateFilter;

      return matchesWorker && matchesOperation && matchesProduction && matchesDate;
    });
  }, [assignments, workerFilter, operationFilter, productionFilter, dateFilter]);

  return (
    <div className="mt-10 bg-white rounded-md border shadow-sm p-4 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-4">Operation Records</h2>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {/* Worker Filter */}
        <div>
          <label className="text-sm font-medium mb-1 block">Filter by Worker</label>
          <Select onValueChange={setWorkerFilter} value={workerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Workers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workers</SelectItem>
              {workers.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Operation Filter */}
        <div>
          <label className="text-sm font-medium mb-1 block">Filter by Operation</label>
          <Select onValueChange={setOperationFilter} value={operationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Operations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operations</SelectItem>
              {operations.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Production Filter */}
        <div>
          <label className="text-sm font-medium mb-1 block">Filter by Production</label>
          <Select onValueChange={setProductionFilter} value={productionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Productions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Productions</SelectItem>
              {productions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-sm font-medium mb-1 block">Filter by Date</label>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker Name</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No records matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.workerName}</TableCell>
                  <TableCell>{item.operationName}</TableCell>
                  <TableCell>{item.piecesDone}</TableCell>
                  <TableCell>{item.productionName}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
