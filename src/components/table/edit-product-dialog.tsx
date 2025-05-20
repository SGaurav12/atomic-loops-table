import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { editProductSchema } from "@/schema";
import { useEditProductDialogState } from "@/store/edit-product-state";

export type EditProductData = z.infer<typeof editProductSchema>;

export function EditProductDialog() {
  const {
    open,
    setOpen,
    initialData,
    setInitialData,
    close,
  } = useEditProductDialogState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProductData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: initialData || {},
  });

  // Reset form when the dialog opens
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSave = (data: EditProductData) => {

    console.log("Saving product data:", data);
    // Here you would typically send the data to your API or state management
    try {
      close();
      setInitialData(null); // Clear initial data after saving
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              {...register("title")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              {...register("price")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}