
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Production, ProductionReport, EmployeePerformance } from "@/types/production";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for productions
const mockProductions: Production[] = [
  {
    id: '1',
    name: 'Summer T-Shirt Collection',
    productionId: 'PRD-2023-001',
    poNumber: 'PO-12345',
    color: 'Blue',
    totalFabric: 500,
    average: 0.5,
    totalQuantity: 1000,
    operations: [
      {
        id: '1-1',
        name: 'Cutting',
        ratePerPiece: 5,
        isCompleted: false,
        productionId: '1'
      },
      {
        id: '1-2',
        name: 'Stitching',
        ratePerPiece: 15,
        isCompleted: false,
        productionId: '1'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-01-20')
  },
  {
    id: '2',
    name: 'Winter Jacket Production',
    productionId: 'PRD-2023-002',
    poNumber: 'PO-67890',
    color: 'Black',
    totalFabric: 1200,
    average: 2.4,
    totalQuantity: 500,
    operations: [
      {
        id: '2-1',
        name: 'Cutting',
        ratePerPiece: 8,
        isCompleted: false,
        productionId: '2'
      },
      {
        id: '2-2',
        name: 'Stitching',
        ratePerPiece: 25,
        isCompleted: false,
        productionId: '2'
      },
      {
        id: '2-3',
        name: 'Washing',
        ratePerPiece: 12,
        isCompleted: false,
        productionId: '2'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-02-15')
  }
];

// Mock data for reports
const mockReports: { [key: string]: ProductionReport } = {
  '1': {
    daily: {
      productionQuantity: 45,
      operationExpense: 2250,
      rawMaterialCost: 6000,
      totalExpense: 8250,
      efficiency: 85
    },
    weekly: {
      productionQuantity: 300,
      operationExpense: 15000,
      rawMaterialCost: 40000,
      totalExpense: 55000,
      efficiency: 82
    },
    monthly: {
      productionQuantity: 1200,
      operationExpense: 60000,
      rawMaterialCost: 160000,
      totalExpense: 220000,
      efficiency: 80
    },
    yearly: {
      productionQuantity: 14400,
      operationExpense: 720000,
      rawMaterialCost: 1920000,
      totalExpense: 2640000,
      efficiency: 78
    }
  },
  '2': {
    daily: {
      productionQuantity: 25,
      operationExpense: 3750,
      rawMaterialCost: 10000,
      totalExpense: 13750,
      efficiency: 88
    },
    weekly: {
      productionQuantity: 175,
      operationExpense: 26250,
      rawMaterialCost: 70000,
      totalExpense: 96250,
      efficiency: 86
    },
    monthly: {
      productionQuantity: 700,
      operationExpense: 105000,
      rawMaterialCost: 280000,
      totalExpense: 385000,
      efficiency: 84
    },
    yearly: {
      productionQuantity: 8400,
      operationExpense: 1260000,
      rawMaterialCost: 3360000,
      totalExpense: 4620000,
      efficiency: 82
    }
  }
};

// Mock data for employee performance
const mockEmployeePerformance: EmployeePerformance[] = [
  {
    employeeId: 'EMP-001',
    employeeName: 'John Doe',
    totalPiecesCompleted: 450,
    totalOperations: 3,
    efficiency: 92,
    earnings: 6750
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Jane Smith',
    totalPiecesCompleted: 380,
    totalOperations: 2,
    efficiency: 88,
    earnings: 5700
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'Robert Johnson',
    totalPiecesCompleted: 500,
    totalOperations: 4,
    efficiency: 95,
    earnings: 7500
  },
  {
    employeeId: 'EMP-004',
    employeeName: 'Lisa Brown',
    totalPiecesCompleted: 410,
    totalOperations: 3,
    efficiency: 89,
    earnings: 6150
  }
];

const ReportsPage: React.FC = () => {
  const [selectedProductionId, setSelectedProductionId] = useState<string>(mockProductions[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const selectedProduction = mockProductions.find(p => p.id === selectedProductionId);
  const productionReport = selectedProductionId ? mockReports[selectedProductionId] : null;

  // Convert report data for chart
  const chartData = productionReport ? [
    {
      name: 'Production Cost Breakdown',
      'Operation Expense': productionReport[selectedPeriod].operationExpense,
      'Raw Material Cost': productionReport[selectedPeriod].rawMaterialCost,
      'Total Expense': productionReport[selectedPeriod].totalExpense,
    }
  ] : [];

  // Generate quantity by operation data for chart
  const operationsData = selectedProduction?.operations.map(op => ({
    name: op.name,
    'Cost per Operation': op.ratePerPiece * productionReport?.[selectedPeriod].productionQuantity || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View detailed reports on production performance and employee productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Select Production</CardTitle>
            <CardDescription>Choose a production to view its reports</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {mockProductions.map((production) => (
                <div
                  key={production.id}
                  className={`p-3 mb-2 rounded-md cursor-pointer ${
                    selectedProductionId === production.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedProductionId(production.id)}
                >
                  <div className="font-medium">{production.name}</div>
                  <div className="text-sm">ID: {production.productionId}</div>
                  <div className="text-sm">
                    Color: {production.color} | Quantity: {production.totalQuantity} pcs
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Production Overview</CardTitle>
              <Select 
                value={selectedPeriod} 
                onValueChange={(value) => setSelectedPeriod(value as any)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {selectedProduction?.name || 'Select a production to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProduction ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm mb-1">Production</div>
                    <div className="text-2xl font-bold">
                      {productionReport?.[selectedPeriod].productionQuantity || 0} pcs
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm mb-1">Expense</div>
                    <div className="text-2xl font-bold">
                      ₹{productionReport?.[selectedPeriod].totalExpense.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm mb-1">Raw Material</div>
                    <div className="text-2xl font-bold">
                      ₹{productionReport?.[selectedPeriod].rawMaterialCost.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm mb-1">Efficiency</div>
                    <div className="text-2xl font-bold">
                      {productionReport?.[selectedPeriod].efficiency || 0}%
                    </div>
                  </div>
                </div>

                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Operation Expense" fill="#8884d8" />
                      <Bar dataKey="Raw Material Cost" fill="#82ca9d" />
                      <Bar dataKey="Total Expense" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={operationsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Cost per Operation" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Select a production from the left to view reports
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production" className="w-full">
        <TabsList>
          <TabsTrigger value="production">Production Details</TabsTrigger>
          <TabsTrigger value="employee">Employee Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Operations</CardTitle>
              <CardDescription>
                Details of operations and costs for {selectedProduction?.name || 'selected production'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProduction ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operation</TableHead>
                      <TableHead>Rate Per Piece</TableHead>
                      <TableHead>Total Pieces</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduction.operations.map(operation => {
                      // Mock completion data
                      const completionPercentage = Math.floor(Math.random() * 100);
                      const completedPieces = Math.floor(selectedProduction.totalQuantity * (completionPercentage / 100));
                      
                      return (
                        <TableRow key={operation.id}>
                          <TableCell>{operation.name}</TableCell>
                          <TableCell>₹{operation.ratePerPiece}</TableCell>
                          <TableCell>{selectedProduction.totalQuantity}</TableCell>
                          <TableCell>₹{operation.ratePerPiece * selectedProduction.totalQuantity}</TableCell>
                          <TableCell>
                            {completionPercentage}% ({completedPieces}/{selectedProduction.totalQuantity})
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Select a production to view operation details
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>
                Productivity metrics for employees working on production operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Total Pieces</TableHead>
                    <TableHead>Operations</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployeePerformance.map(employee => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>{employee.employeeName}</TableCell>
                      <TableCell>{employee.employeeId}</TableCell>
                      <TableCell>{employee.totalPiecesCompleted}</TableCell>
                      <TableCell>{employee.totalOperations}</TableCell>
                      <TableCell>{employee.efficiency}%</TableCell>
                      <TableCell>₹{employee.earnings}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
