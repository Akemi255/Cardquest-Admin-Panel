"use client"
import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, min } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SetEmail } from '@/helpers/setEmail';
import { Textarea } from '@/components/ui/textarea';

const FormSchema = z.object({
    email: z.string().email(),
    dob: z.date({
        required_error: "Fecha de desbaneo requerida",
    }),
    reason: z.string().max(50),
});

export function BanSection() {

    const adminEmail = SetEmail();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setLoading(true);
            let hasActiveBan = false; 

            if (data.email === adminEmail) {
                toast.error("No puedes banearte a ti mismo");
                setLoading(false);
                return;
            }

            // Convertir la fecha de desbaneo a un formato legible para el servidor
            const formattedDate = data.dob.toISOString();

            // Enviar la solicitud al servidor
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/temporalBan`, {
                adminEmail: adminEmail,
                userEmail: data.email,
                banDate: formattedDate,
                reason: data.reason,
            });

            // Verificar si se detectó un baneo activo
            if (response.status === 203) {
                toast.error("Error... el usuario ya tiene un baneo activo");
                hasActiveBan = true;
            }

            // Mostrar el mensaje de éxito solo si no se ha detectado un baneo activo
            if (!hasActiveBan) {
                toast.success("Datos enviados correctamente");
            }

        } catch (error) {
            toast.error("Ups... parece que no tienes los permisos suficientes");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Email de usuario a banear</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        className='sm:w-[240px]'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Motivo del baneo</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Escribe el motivo del baneo aquí."
                                        className="sm:w-[240px] h-[50px] resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de desbaneo</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                new Date(date) <= new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="outline" className={`text-white bg-black hover:bg-gray-700 ${loading && 'cursor-not-allowed opacity-50'}`} disabled={loading}>
                        {loading ? 'Enviando datos...' : 'Enviar solicitud'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
