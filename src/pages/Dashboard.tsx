
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Scissors, Clock, BarChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Mock data for dashboard
  const productionStats = [
    { id: 'P001', name: 'Summer Shirt 2025', progress: 65 },
    { id: 'P002', name: 'Formal Trousers', progress: 42 },
    { id: 'P003', name: 'Winter Jacket', progress: 89 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your production and operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Total Employees' : 'Total Workers'}
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Users size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? 24 : 48}</div>
            <p className="text-xs text-muted-foreground">
              +2 in the last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <div className="bg-secondary/10 p-2 rounded-full text-secondary">
              <Scissors size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 pending completion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <div className="bg-accent/10 p-2 rounded-full text-accent">
              <Clock size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243 pcs</div>
            <p className="text-xs text-muted-foreground">
              +18% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Salary Pending' : 'Today\'s Operations'}
            </CardTitle>
            <div className="bg-red-100 p-2 rounded-full text-red-500">
              <BarChart size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? '₹45,231' : '8'}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'For this month' : 'Across 3 products'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Production Progress</CardTitle>
            <CardDescription>
              Current status of active production orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {productionStats.map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.progress}%</span>
                  </div>
                  <Progress value={product.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{isAdmin ? 'Recent Employees' : 'Recent Workers'}</CardTitle>
            <CardDescription>
              Recently added {isAdmin ? 'employees' : 'workers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isAdmin ? `Employee ${i}` : `Worker ${i}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Added on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
