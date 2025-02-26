"use client"

import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Image_upload from "@/components/Image_upload";

interface CompanionFormProps{
    initialData: Companion | null;
    categories: Category[];

}

const formSchema = z.object({
  name: z.string().min(1,{
    message:"Name is required."
  }),
  description: z.string().min(1,{
    message:"Description is required."
  }),
  instruction: z.string().min(200,{
    message:"Instruction is required."
  }),
  seed: z.string().min(1,{
    message:"Seed require at least 200 characters."
  }),
  src: z.string().min(1,{
    message:"Image is required."
  }),
  categoryId: z.string().min(1,{
    message:"Category is required."
  }),
  
})

const Companion_form = ({
    categories, initialData
}: CompanionFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instruction: "",
      seed: "", 
      src: "",
      category: ""
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof form>)=>{
    console.log(values)
  }


  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
          <div className="space-y-2 w-full">
          <div>

            <h3 className="text-lg font-medium">
                General Information
            </h3>
            <p className="tex-xm text-muted-foreground">
              General Information about your souls
            </p>
            </div>
            <Separator className="bg-primary/10"/>
          </div>

            <FormField  name="src"
            render={({field})=>(
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <Image_upload disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

              </FormItem>
            )} />

        </form>
        </Form>
    </div>
  )
}

export default Companion_form
