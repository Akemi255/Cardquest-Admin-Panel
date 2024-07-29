import { AdminPanel } from "@/components/layout/admin-panel";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormErrorMessage,
} from "@/components/ui/form";
import { AddCardSchema } from "./components/AddCardSchema";
import { z } from "zod";
import { useRef } from "react";

const Page = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof AddCardSchema>>({});

  return (
    <>
      <AdminPanel>
        <Form {...form}>
          <form ref={formRef}></form>
        </Form>
      </AdminPanel>
    </>
  );
};

export default Page;
