
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Operation, Product, ProductFormData, OperationFormData } from '@/types/product';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Package, Plus, Upload, X } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const operationSchema = z.object({
  name: z.string().min(1, "Operation name is required"),
  operationId: z.string().min(1, "Operation ID is required"),
  amountPerPiece: z.coerce.number().min(0, "Amount must be a positive number"),
});

const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  productId: z.string().min(3, "Product ID must be at least 3 characters"),
  designNo: z.string().min(3, "Design number must be at least 3 characters"),
  color: z.string().min(1, "Color is required"),
  patternImage: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max file size is 10MB'
  ).refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, and .png formats are supported'
  ).nullable().optional(),
  materialCost: z.coerce.number().min(0, "Material cost must be a positive number"),
  threadCost: z.coerce.number().min(0, "Thread cost must be a positive number"),
  otherCosts: z.coerce.number().min(0, "Other costs must be a positive number"),
  operations: z.array(operationSchema).min(1, "At least one operation is required"),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddProduct 
}) => {
  const { toast } = useToast();
  const [patternImagePreview, setPatternImagePreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productId: "",
      designNo: "",
      color: "",
      materialCost: 0,
      threadCost: 0,
      otherCosts: 0,
      operations: [{ name: "", operationId: "", amountPerPiece: 0 }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "operations",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const operations: Operation[] = values.operations.map((op, index) => ({
      id: `new-op-${index}`,
      name: op.name,
      operationId: op.operationId,
      amountPerPiece: op.amountPerPiece,
      productId: values.productId,
    }));

    // Create a new product object with the form values
    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 11), // Simple ID generation for mock data
      name: values.name,
      productId: values.productId,
      designNo: values.designNo,
      color: values.color,
      patternImageUrl: patternImagePreview || '/placeholder.svg', // Use preview URL or default placeholder
      materialCost: values.materialCost,
      threadCost: values.threadCost,
      otherCosts: values.otherCosts,
      operations: operations,
      createdBy: 'admin',
      createdAt: new Date(),
    };

    onAddProduct(newProduct);
    toast({
      title: "Product added",
      description: `${values.name} has been successfully added`,
    });
    onOpenChange(false);
    form.reset();
    setPatternImagePreview(null);
  };

  const handlePatternImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Pattern image must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .jpg, .jpeg, and .png formats are supported",
          variant: "destructive",
        });
        return;
      }
      
      form.setValue("patternImage", file);
      setPatternImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Cotton T-Shirt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="PROD123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="designNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Number</FormLabel>
                    <FormControl>
                      <Input placeholder="D-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label>Pattern Image</Label>
              <div className="mt-2">
                <Label 
                  htmlFor="pattern-image-upload" 
                  className="cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-6 hover:bg-gray-50"
                >
                  {patternImagePreview ? (
                    <div className="text-center">
                      <img 
                        src={patternImagePreview} 
                        alt="Pattern" 
                        className="h-32 mx-auto object-contain" 
                      />
                      <p className="text-xs text-center mt-2">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm mt-2">Upload pattern image</p>
                      <p className="text-xs text-gray-500">JPG, JPEG, PNG (max 10MB)</p>
                    </div>
                  )}
                </Label>
                <Input
                  id="pattern-image-upload"
                  type="file"
                  className="sr-only"
                  accept=".jpg,.jpeg,.png"
                  onChange={handlePatternImageChange}
                />
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3">Cost Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="materialCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Cost (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="threadCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thread Cost (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Costs (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Operations</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", operationId: "", amountPerPiece: 0 })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Operation
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3 pb-3 border-b last:border-b-0 last:pb-0 last:mb-0">
                  <FormField
                    control={form.control}
                    name={`operations.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Operation Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cutting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`operations.${index}.operationId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Operation ID</FormLabel>
                        <FormControl>
                          <Input placeholder="OP001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`operations.${index}.amountPerPiece`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Amount/Piece (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              className="w-20" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mb-[2px]"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove operation</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
