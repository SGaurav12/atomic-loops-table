import * as z from "zod";

export const editProductSchema = z.object({
  title: z.string().nonempty({message: "Title should not be empty."}).min(5, {message: "Title must be at least 5 characters."}),
  description: z.string().nonempty({message: "Description should not be empty."}).min(10, {message: "Description must be at least 10 characters."}),
  price: z.coerce.number().gt(0, {message: "Price must be greater than zero."}),
});


export const LoginSchema = z.object({
  email: z.string().nonempty({message: "Email should not be empty."}).min(1, { message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});


export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  confirm_password: z.string().min(4, { message: "Re-enter the password" }),
});