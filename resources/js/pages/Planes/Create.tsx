import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion: 30,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/planes');
    };

    return (
        <>
            <Head title="Crear Plan" />

            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Crear Nuevo Plan</h1>
                    <Link
                        href="/planes"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Volver al listado
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Plan
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej. Musculación Pase Libre"
                        />
                        {errors.nombre && (
                            <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción (Opcional)
                        </label>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Detalles sobre lo que incluye este plan..."
                        />
                        {errors.descripcion && (
                            <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.precio}
                                onChange={(e) => setData('precio', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="25000"
                            />
                            {errors.precio && (
                                <p className="text-red-600 text-sm mt-1">{errors.precio}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración (Días)
                            </label>
                            <input
                                type="number"
                                value={data.duracion}
                                onChange={(e) => setData('duracion', parseInt(e.target.value) || 0)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="30"
                            />
                            {errors.duracion && (
                                <p className="text-red-600 text-sm mt-1">{errors.duracion}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/planes"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}