import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { EditProductData } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveEditedProduct, getEditedProductById } from "@/utils/localStorageUtils";
import { ArrowLeft } from "lucide-react";
import { editProductSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormState } from "@/store/product-form-state";
import { useHookstate } from "@hookstate/core";

import { 
  Form, 
  FormField, 
  FormItem, 
  FormControl, 
  FormMessage, 
  FormLabel
 } from "@/components/ui/form";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useHookstate(productFormState);

const form = useForm<EditProductData>({
    resolver: zodResolver(editProductSchema),
    mode: "onTouched",
    defaultValues: state.data.get(),
  });

  const { reset } = form;
  
  async function fetchProductById(id: string) {
  const localData = getEditedProductById(Number(id));
  if (localData) return localData;

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return await res.json();
}

useEffect(() => {
  if (!id) return;

  state.loading.set(true);
  fetchProductById(id)
    .then((data) =>
      reset({
        title: data.title,
        description: data.description,
        price: data.price,
      })
    )
    .catch((error) => console.error("Fetch error:", error))
    .finally(() => state.loading.set(false));
}, [id, reset]);


  const onSubmit = async (data: EditProductData) => {
    state.saving.set(true);
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save product");

      const responseData = await res.json();
      saveEditedProduct(Number(id), responseData);
      navigate("/", { state: responseData });
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      state.saving.set(false);
    }
  };

  if (!id) return <p className="text-center text-red-500">No Product ID found.</p>;
  if (state.loading.get()) return <p className="text-center text-sm">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField 
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title..." {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="price"
            render={({field}) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter price"  type="number" step="0.01" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={state.saving.get()}>
            {state.saving.get()? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
