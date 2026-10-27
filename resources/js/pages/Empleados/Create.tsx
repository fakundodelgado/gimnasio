import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        cuil: '',
        telefono: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/empleados');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
            <h1>Crear Empleado</h1>

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
                    <label>Contraseña:</label><br />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        style={{ width: '100%' }}
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
                    Guardar
                </button>
                <Link href="/empleados">Volver</Link>
            </form>
        </div>
    );
}