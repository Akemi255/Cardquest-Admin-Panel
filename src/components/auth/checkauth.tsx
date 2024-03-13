"use client"
import { SetEmail } from "@/helpers/setEmail";
import { useEffect } from "react";
import axios from 'axios';
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Chekauth = () => {
    const email = SetEmail();
    const { signOut } = useClerk();
    const router = useRouter();

    useEffect(() => {
        let timeoutId: any;
        console.log(process.env.NEXT_PUBLIC_API_URL);
        
        if (email) {
            timeoutId = setTimeout(() => {
                const fetchData = async () => {
                    try {
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/chekauth`, { email });

                        if (response.data.userRole === 'admin' || response.data.userRole === 'mod') {
                            return;
                        } else {
                            signOut(() => router.push("/"))
                            toast.error("No tienes los roles necesarios para acceder al panel");
                        }
                    } catch (error) {
                        toast.error('Error de red');
                    }
                };
                fetchData();
            }, 100);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [email, signOut, router]);

    return (
        <></>
    );
};

export default Chekauth;
