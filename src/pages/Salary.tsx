
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeSalaryTable } from '@/components/salary/EmployeeSalaryTable';
import { WorkerSalaryTable } from '@/components/salary/WorkerSalaryTable';
import { AddEmployeeSalaryDialog } from '@/components/salary/AddEmployeeSalaryDialog';
import { AddWorkerSalaryDialog } from '@/components/salary/AddWorkerSalaryDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calculator, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { WorkerSalary } from '@/types/salary';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Mock data for worker salaries
const initialWorkerSalaries: WorkerSalary[] = [
  {
    id: '1',
    workerId: 'WOR001',
    productId: 'P001',
    date: new Date('2023-04-15'),
    operationId: 'OP001',
    piecesDone: 45,
    amountPerPiece: 5,
    totalAmount: 45 * 5,
    paid: true,
    paidDate: new Date('2023-04-16'),
    paidBy: 'supervisor'
  },
  {
    id: '2',
    workerId: 'WOR002',
    productId: 'P002',
    date: new Date('2023-04-16'),
    operationId: 'OP002',
    piecesDone: 30,
    amountPerPiece: 10,
    totalAmount: 30 * 10,
    paid: true,
    paidDate: new Date('2023-04-17'),
    paidBy: 'admin'
  },
  {
    id: '3',
    workerId: 'WOR001',
    productId: 'P003',
    date: new Date('2023-04-17'),
    operationId: 'OP003',
    piecesDone: 25,
    amountPerPiece: 15,
    totalAmount: 25 * 15,
    paid: false
  }
];

const Salary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<string>("workers");
  const [isAddEmployeeSalaryOpen, setIsAddEmployeeSalaryOpen] = useState(false);
  const [isAddWorkerSalaryOpen, setIsAddWorkerSalaryOpen] = useState(false);
  const [workerSalaries, setWorkerSalaries] = useState<WorkerSalary[]>(initialWorkerSalaries);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Function to add a new worker salary record
  const addWorkerSalary = (newSalary: WorkerSalary) => {
    setWorkerSalaries(prev => [...prev, newSalary]);
    toast({
      title: "Success",
      description: "Worker salary record has been added successfully.",
    });
  };
  
  // Function to calculate all worker salaries based on their monthly operations
  const calculateAllWorkerSalaries = () => {
    // In a real app, this would fetch from the database and calculate
    // For now, we'll just show a toast message
    toast({
      title: "Salaries Calculated",
      description: "All worker salaries have been calculated based on their monthly operations.",
    });
  };
  
  // Ensure only admin and supervisor can access this page
  if (user?.role !== 'admin' && user?.role !== 'supervisor') {
    return <Navigate to="/dashboard" />;
  }

  // Render buttons based on device type and active tab
  const renderActionButtons = () => {
    if (activeTab === "workers") {
      return (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={calculateAllWorkerSalaries}
            className={isMobile ? "px-2 py-1 h-8" : ""}
            size={isMobile ? "sm" : "default"}
          >
            <Calculator className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`} /> 
            {!isMobile && "Calculate All"}
          </Button>
          <Button 
            onClick={() => setIsAddWorkerSalaryOpen(true)}
            className={isMobile ? "px-2 py-1 h-8" : ""}
            size={isMobile ? "sm" : "default"}
          >
            <PlusCircle className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`} /> 
            {!isMobile && "Add Worker Salary"}
          </Button>
        </div>
      );
    } else if (activeTab === "employees" && isAdmin) {
      return (
        <Button 
          onClick={() => setIsAddEmployeeSalaryOpen(true)}
          className={isMobile ? "px-2 py-1 h-8" : ""}
          size={isMobile ? "sm" : "default"}
        >
          <PlusCircle className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`} /> 
          {!isMobile && "Add Employee Salary"}
        </Button>
      );
    }
    return null;
  };

  // Mobile view with sheet for action buttons
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold tracking-tight">Salary Management</h1>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[280px]">
              <div className="py-4 space-y-4">
                <h2 className="text-lg font-medium">Actions</h2>
                <div className="space-y-2">
                  {activeTab === "workers" && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          calculateAllWorkerSalaries();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <Calculator className="mr-2 h-4 w-4" /> Calculate All Salaries
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsAddWorkerSalaryOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Worker Salary
                      </Button>
                    </>
                  )}
                  {activeTab === "employees" && isAdmin && (
                    <Button 
                      onClick={() => {
                        setIsAddEmployeeSalaryOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Employee Salary
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="workers" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="workers">Workers</TabsTrigger>
            {isAdmin && <TabsTrigger value="employees">Employees</TabsTrigger>}
          </TabsList>

          <TabsContent value="workers" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Workers Salary Records</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkerSalaryTable salaries={workerSalaries} setSalaries={setWorkerSalaries} />
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="employees" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Employees Salary Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmployeeSalaryTable />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <AddWorkerSalaryDialog 
          open={isAddWorkerSalaryOpen} 
          onOpenChange={setIsAddWorkerSalaryOpen} 
          onAddSalary={addWorkerSalary}
        />

        {isAdmin && (
          <AddEmployeeSalaryDialog 
            open={isAddEmployeeSalaryOpen} 
            onOpenChange={setIsAddEmployeeSalaryOpen} 
          />
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
      </div>

      <Tabs defaultValue="workers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="workers">Workers Salary</TabsTrigger>
            {isAdmin && <TabsTrigger value="employees">Employees Salary</TabsTrigger>}
          </TabsList>
          
          {renderActionButtons()}
        </div>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workers Salary Records</CardTitle>
              <CardDescription>
                Monthly salary payments to production workers based on operations and piece rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkerSalaryTable salaries={workerSalaries} setSalaries={setWorkerSalaries} />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employees Salary Records</CardTitle>
                <CardDescription>
                  Manage monthly salary payments to permanent employees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeSalaryTable />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <AddWorkerSalaryDialog 
        open={isAddWorkerSalaryOpen} 
        onOpenChange={setIsAddWorkerSalaryOpen} 
        onAddSalary={addWorkerSalary}
      />

      {isAdmin && (
        <AddEmployeeSalaryDialog 
          open={isAddEmployeeSalaryOpen} 
          onOpenChange={setIsAddEmployeeSalaryOpen} 
        />
      )}
    </div>
  );
};

export default Salary;
