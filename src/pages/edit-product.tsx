import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "@/schema";
import type { EditProductData } from "@/types";
import { useProductFormState } from "@/store/product-form-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { state, fetchProductById, saveProduct } = useProductFormState(id);

  const form = useForm<EditProductData>({
    resolver: zodResolver(editProductSchema),
    mode: "onTouched",
    defaultValues: state.data.get(),
  });

  const { reset } = form;

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then((data: any) =>
        reset({
          title: data.title,
          description: data.description,
          price: data.price,
        })
      )
      .catch((error) => console.error("Fetch error:", error));
    // eslint-disable-next-line
  }, [id, reset]);

  const onSubmit = async (data: EditProductData) => {
    await saveProduct(data, id);
  };

  if (!id) return <p className="text-center text-red-500">No Product ID found.</p>;
  if (state.loading.get()) return <p className="text-center text-sm">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="mb-6 hover:bg-gray-100"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter price" type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={state.saving.get()}>
            {state.saving.get() ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}