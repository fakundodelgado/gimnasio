import React from 'react';
import { Link } from '@inertiajs/react';

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function Show({ empleado }: { empleado: Employee }) {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Detalle del Empleado #{empleado.id}</h1>

            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                <p><strong>Nombre:</strong> {empleado.user?.name}</p>
                <p><strong>Email:</strong> {empleado.user?.email}</p>
                <p><strong>CUIL:</strong> {empleado.cuil}</p>
                <p><strong>Teléfono:</strong> {empleado.telefono}</p>
            </div>

            <Link href={`/empleados/${empleado.id}/edit`} style={{ marginRight: '10px' }}>
                Editar
            </Link>
            <Link href="/empleados">Volver al listado</Link>
        </div>
    );
}