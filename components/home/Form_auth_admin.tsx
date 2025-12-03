
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { formSchema } from "@/schemas/formSchema";
import { useAuthAdmin } from "@/hooks/useAuthAdmin"; 
import Image from "next/image";


export function FormAuthAdmin({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, loading, error } = useAuthAdmin(); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn(values.email, values.password); // Call the signIn function from the hook
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="pb-18 flex flex-col items-center gap-2 text-center">
        <Image src="/logoSJD.png" alt="logo" width={100} height={100} className="cursor-pointer" />

      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="Usuario" 
                      className="bg-white border-2 border-transparent bg-gradient-to-r from-blue-500 via-white to-red-500 bg-clip-border p-[2px] rounded-md selection:bg-black selection:text-white max-sm:border-1 max-sm:border-transparent max-sm:bg-gradient-to-r max-sm:from-red-500 max-sm:via-white max-sm:to-blue-500 max-sm:bg-clip-border px-4 py-3"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #3b82f6, white, #ef4444) border-box'
                      }}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña"
                      className="bg-white border-2 border-transparent bg-gradient-to-r from-blue-500 via-white to-red-500 bg-clip-border p-[2px] rounded-md selection:bg-black selection:text-white max-sm:border-1 max-sm:border-transparent max-sm:bg-gradient-to-r max-sm:from-red-500 max-sm:via-white max-sm:to-blue-500 max-sm:bg-clip-border px-4 py-3"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #3b82f6, white, #ef4444) border-box'
                      }}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button variant="outline" type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </Button>
          
        </form>
      </Form>

      {error && (
        <p className="text-sm text-center text-white md:text-black">
          Le erraste como en la cancha
        </p>
      )}
      
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        
      </div>
      
      <Link href="/capitan">
        <Button 
          variant="outline" 
          className="cursor-pointer w-full bg-gradient-to-r from-blue-500 via-white to-red-500 text-gray-900  hover:from-blue-600 hover:via-gray-100 hover:to-red-600 transition-all duration-300"
        >
          <Crown className="mr-2 h-4 w-4" />
          Soy capitán
        </Button>
      </Link>
    </div>
  );
}