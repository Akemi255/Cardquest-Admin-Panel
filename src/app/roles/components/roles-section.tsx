"use client"
import { useState, useEffect } from 'react';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import axios from 'axios';
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

import { SetEmail } from '@/helpers/setEmail';


interface User {
    _id: string;
    email: string;
    name: string;
    userRole: string;
}

const RolesSection = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUserRole, setSelectedUserRole] = useState<string | null>(null);
    const email = SetEmail();

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getAllUsersForAdmins`)
            .then(response => {
                if (Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                } else {
                    toast.error("La respuesta de la solicitud no contiene usuarios válidos");
                }
            })
            .catch(error => {
                toast.error("Error al obtener los usuarios");
                console.error(error);
            });
    }, []);

    const handleRoleChange = (userId: string, newRole: string) => {
        const originalRole = users.find(user => user._id === userId)?.userRole;
        const userEmail = users.find(user => user._id === userId)?.email;

        if (userEmail === email) {
            setSelectedUserId(userId);
            setSelectedUserRole(newRole);
            setShowConfirmationDialog(true);
        } else {
            updateUserRole(userId, newRole, originalRole);
        }
    };

    const confirmRoleChange = () => {
        updateUserRole(selectedUserId!, selectedUserRole!);
        setShowConfirmationDialog(false);
    };

    const updateUserRole = (userId: string, newRole: string, originalRole?: string) => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/changeRole`, {
            userId: userId,
            newRole: newRole,
            email: email
        })
            .then(response => {
                toast.success("Rol actualizado correctamente");
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, userRole: newRole } : user
                    )
                );
            })
            .catch(error => {
                toast.error("Ups... Parece que no dispones de los permisos necesarios");
                console.error(error);
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, userRole: originalRole || '' } : user
                    )
                );
            });
    };

    return (
        <>
            <div className="border shadow-sm rounded-lg p-2 overflow-y-auto lg:max-h-[650px] md:max-h-[350px] sm:max-h-[350px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left sm:table-cell">Usuario</TableHead>
                            <TableHead className="text-center md:table-cell sm:hidden">Email</TableHead>
                            <TableHead className="text-center sm:table-cell">Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell className='text-center md:table-cell sm:hidden'>{user.email}</TableCell>
                                <TableCell className="text-right sm:table-cell">
                                    <div className="flex justify-center">
                                        <Select
                                            onValueChange={(newValue) => handleRoleChange(user._id, newValue)}
                                            value={user.userRole}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder={user.userRole}></SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mod">Mod</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Diálogo de confirmación */}
            {showConfirmationDialog && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h1 className='text-black'>Estás seguro de cambiar tu propio rol?</h1>
                        <p className='text-gray-500 mt-3'>Esta acción no tiene vuelta a atrás</p>
                        <div className="flex justify-center mt-4 gap-2">
                            <Button className="rounded hover:bg-slate-100" variant='outline' onClick={() => setShowConfirmationDialog(false)}>Cancelar</Button>
                            <Button className="rounded hover:bg-gray-700 bg-black text-white" variant='outline' onClick={confirmRoleChange}>Confirmar</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
};

export default RolesSection;
