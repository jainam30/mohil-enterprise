
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/products/ProductTable";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { Product } from '@/types/product';

// Mock data for initial development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cotton T-Shirt',
    productId: 'PROD001',
    designNo: 'D-1234',
    color: 'Blue',
    patternImageUrl: '/placeholder.svg',
    materialCost: 120,
    threadCost: 20,
    otherCosts: 10,
    operations: [
      {
        id: '1-1',
        name: 'Cutting',
        operationId: 'OP001',
        amountPerPiece: 5,
        productId: '1'
      },
      {
        id: '1-2',
        name: 'Stitching',
        operationId: 'OP002',
        amountPerPiece: 15,
        productId: '1'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-01-20')
  },
  {
    id: '2',
    name: 'Denim Jeans',
    productId: 'PROD002',
    designNo: 'D-4567',
    color: 'Black',
    patternImageUrl: '/placeholder.svg',
    materialCost: 250,
    threadCost: 30,
    otherCosts: 20,
    operations: [
      {
        id: '2-1',
        name: 'Cutting',
        operationId: 'OP001',
        amountPerPiece: 8,
        productId: '2'
      },
      {
        id: '2-2',
        name: 'Stitching',
        operationId: 'OP002',
        amountPerPiece: 25,
        productId: '2'
      },
      {
        id: '2-3',
        name: 'Washing',
        operationId: 'OP003',
        amountPerPiece: 12,
        productId: '2'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-02-15')
  }
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.designNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            View, add, and manage all your production products here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, ID, design no, or color..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ProductTable 
            products={filteredProducts} 
            onUpdateProduct={handleUpdateProduct}
          />
        </CardContent>
      </Card>

      <AddProductDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Products;
