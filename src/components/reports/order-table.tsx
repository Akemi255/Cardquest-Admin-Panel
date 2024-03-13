"use client"
import { useState, useEffect } from 'react';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import axios from 'axios';
import toast from "react-hot-toast";
import { TrashIcon } from 'lucide-react';

import { formatDate } from '@/helpers/formatDate';
import { SetEmail } from '@/helpers/setEmail';

export function OrderTable() {

    const email = SetEmail();

    interface Report {
        _id: string;
        timestamp: string;
        reportedUser: string;
        cause: string;
        reporter: string;
    }

    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {    
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/getAllReports`);
                const data: Report[] = response.data;
                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
                toast.error("Ha ocurrido un error obteniendo los datos");
            }
        };
        fetchReports();
    }, []); 

    const handleDeleteReport = async (reportId: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteReport`, { 
                data: { 
                    reportId: reportId,
                    email: email 
                } 
            });
            const updatedReports = reports.filter(report => report._id !== reportId);
            setReports(updatedReports);
            toast.success("El reporte ha sido eliminado exitosamente");
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Parece que no tienes los permisos necesarios");
        }
    };

    
    return (
        <div className="border shadow-sm rounded-lg p-2 overflow-y-auto lg:max-h-[650px]  md:max-h-[350px] sm:max-h-[350px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell">Fecha</TableHead>
                        <TableHead className="text-left sm:table-cell">Reportado</TableHead>
                        <TableHead className="hidden md:table-cell">Causa</TableHead>
                        <TableHead className="text-left sm:table-cell">Informa</TableHead>
                        <TableHead className="sm:table-cell min-w-[50px]">Borrar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report._id}>
                            <TableCell className="font-medium hidden md:table-cell">{formatDate(report.timestamp)}</TableCell>
                            <TableCell>{report.reportedUser}</TableCell>
                            <TableCell className="hidden md:table-cell">{report.cause}</TableCell>                         
                            <TableCell className="text-left sm:table-cell">{report.reporter}</TableCell>
                            <TableCell className="sm:table-cell min-w-[50px]" onClick={() => handleDeleteReport(report._id)}><TrashIcon className='hover:text-red-500 cursor-pointer'/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
