
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { Product, Operation } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Plus, Package } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onUpdateProduct: (id: string, updatedProduct: Partial<Product>) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const operationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Operation name is required"),
  operationId: z.string().min(1, "Operation ID is required"),
  amountPerPiece: z.coerce.number().min(0, "Amount must be a positive number"),
  productId: z.string().optional(),
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

type FormValues = z.infer<typeof formSchema>;

export const EditProductSheet: React.FC<EditProductSheetProps> = ({
  open,
  onOpenChange,
  product,
  onUpdateProduct
}) => {
  const { toast } = useToast();
  const [patternImagePreview, setPatternImagePreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      productId: '',
      designNo: '',
      color: '',
      materialCost: 0,
      threadCost: 0,
      otherCosts: 0,
      operations: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "operations",
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        productId: product.productId,
        designNo: product.designNo,
        color: product.color,
        materialCost: product.materialCost,
        threadCost: product.threadCost,
        otherCosts: product.otherCosts,
        operations: product.operations
      });

      // Set pattern image preview if available
      if (product.patternImageUrl) {
        setPatternImagePreview(product.patternImageUrl);
      }
    }
  }, [product, form]);

  const onSubmit = async (data: FormValues) => {
    if (!product) return;

    // In a real app, you would upload files to a server here
    // For now, we'll simulate that the upload was successful
    
    const updatedProduct: Partial<Product> = {
      name: data.name,
      productId: data.productId,
      designNo: data.designNo,
      color: data.color,
      materialCost: data.materialCost,
      threadCost: data.threadCost,
      otherCosts: data.otherCosts,
      operations: data.operations as Operation[]
    };

    // Simulate file upload for patternImage
    if (data.patternImage) {
      // In a real app, this would be a URL returned from your file upload service
      updatedProduct.patternImageUrl = URL.createObjectURL(data.patternImage);
    }

    onUpdateProduct(product.id, updatedProduct);
    
    toast({
      title: "Product updated",
      description: `${data.name}'s information has been updated.`,
    });
    
    onOpenChange(false);
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

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Product: {product.name}</SheetTitle>
          <SheetDescription>
            View and update product information. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Design Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Design Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="designNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <Label>Pattern Image</Label>
                  <div className="mt-1 flex items-center">
                    <Label 
                      htmlFor="pattern-image" 
                      className="cursor-pointer flex items-center justify-center border border-dashed rounded-md p-4 w-full"
                    >
                      {patternImagePreview ? (
                        <div className="w-full">
                          <img 
                            src={patternImagePreview} 
                            alt="Pattern" 
                            className="h-32 object-contain mx-auto"
                          />
                          <p className="text-xs text-center mt-2">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Package className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Upload pattern image</p>
                          <p className="text-xs text-gray-500">JPG, JPEG, PNG (max 10MB)</p>
                        </div>
                      )}
                    </Label>
                    <Input 
                      id="pattern-image" 
                      type="file" 
                      className="hidden" 
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePatternImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Cost Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Cost Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="materialCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Cost (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
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
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
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
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Operations */}
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Operations</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ 
                      id: `new-${Date.now()}`, 
                      name: "", 
                      operationId: "", 
                      amountPerPiece: 0,
                      productId: product.id
                    })}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Operation
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3 pb-3 border-b last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <FormField
                      control={form.control}
                      name={`operations.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Operation Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                                onChange={e => field.onChange(Number(e.target.value))}
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
                    
                    {/* Hidden field for id */}
                    <input type="hidden" {...form.register(`operations.${index}.id`)} />
                    <input type="hidden" {...form.register(`operations.${index}.productId`)} value={product.id} />
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="mt-6 flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-1 h-4 w-4" />
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
