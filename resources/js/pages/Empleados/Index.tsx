import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    user: User;
}

export default function Index({ empleados }: { empleados: Employee[] }) {
    const { flash } = usePage().props as any;

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que querés eliminar este empleado?')) {
            router.delete(`/empleados/${id}`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Listado de Empleados</h1>

            {flash?.success && (
                <div style={{ color: 'green', marginBottom: '15px' }}>
                    {flash.success}
                </div>
            )}

            <Link href="/empleados/create" style={{ display: 'inline-block', marginBottom: '15px' }}>
                + Crear Nuevo Empleado
            </Link>

            <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>CUIL</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado) => (
                        <tr key={empleado.id}>
                            <td>{empleado.id}</td>
                            <td>{empleado.user?.name}</td>
                            <td>{empleado.user?.email}</td>
                            <td>{empleado.cuil}</td>
                            <td>{empleado.telefono}</td>
                            <td>
                                <Link href={`/empleados/${empleado.id}`}>Ver</Link> |{' '}
                                <Link href={`/empleados/${empleado.id}/edit`}>Editar</Link> |{' '}
                                <button onClick={() => handleDelete(empleado.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {empleados.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>No hay empleados registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}