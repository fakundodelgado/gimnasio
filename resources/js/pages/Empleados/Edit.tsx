import React from 'react';
import { useForm, Link } from '@inertiajs/react';

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function Edit({ empleado }: { empleado: Employee }) {
    const { data, setData, put, processing, errors } = useForm({
        name: empleado.user?.name || '',
        email: empleado.user?.email || '',
        password: '',
        cuil: empleado.cuil || '',
        telefono: empleado.telefono || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/empleados/${empleado.id}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
            <h1>Editar Empleado</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nombre:</label><br />
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Contraseña (Opcional):</label><br />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="Dejar en blanco para mantener la actual"
                    />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>CUIL (11 dígitos):</label><br />
                    <input
                        type="text"
                        value={data.cuil}
                        onChange={(e) => setData('cuil', e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {errors.cuil && <span style={{ color: 'red' }}>{errors.cuil}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Teléfono:</label><br />
                    <input
                        type="text"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {errors.telefono && <span style={{ color: 'red' }}>{errors.telefono}</span>}
                </div>

                <button type="submit" disabled={processing} style={{ marginRight: '10px' }}>
                    Actualizar
                </button>
                <Link href="/empleados">Volver</Link>
            </form>
        </div>
    );
}