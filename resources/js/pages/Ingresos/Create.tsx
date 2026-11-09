import React, { useRef, useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";

interface CustomPageProps {
    flash?: {
        exito_acceso?: string;
        error_acceso?: string;
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
}

export default function Create() {
    const pageProps = usePage().props as unknown as CustomPageProps;
    const flash = pageProps.flash || {};
    const errors = pageProps.errors || {};

    const inputRef = useRef<HTMLInputElement>(null);
    const [mensajeFeedback, setMensajeFeedback] = useState<{
        texto: string;
        tipo: "exito" | "error";
    } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        client_id: "",
    });

    useEffect(() => {
        const exito = flash.exito_acceso || flash.success;
        const error = flash.error_acceso || flash.error || errors.client_id;

        if (exito) {
            setMensajeFeedback({ texto: exito, tipo: "exito" });
        } else if (error) {
            setMensajeFeedback({ texto: error, tipo: "error" });
        }

        inputRef.current?.focus();
    }, [flash, errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.client_id) return;

        setMensajeFeedback(null);

        post("/ingresos", {
            preserveScroll: true,
            onSuccess: () => {
                reset("client_id");
                inputRef.current?.focus();
            },
            onError: () => {
                inputRef.current?.focus();
            },
        });
    };

    return (
        <>
            <Head title="Control de Acceso" />

            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center space-y-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Control de Acceso
                    </h1>
                    <p className="text-gray-500">
                        Ingrese su ID o número de socio para ingresar
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={data.client_id}
                                onChange={(e) =>
                                    setData("client_id", e.target.value)
                                }
                                placeholder="N° DE SOCIO / ID"
                                disabled={processing}
                                className="w-full text-center text-3xl font-bold py-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 tracking-widest"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.client_id}
                            className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                        >
                            {processing ? "VERIFICANDO..." : "MARCAR INGRESO"}
                        </button>
                    </form>

                    {/* CONFIRMACIÓN VISUAL GIGANTE */}
                    {mensajeFeedback && (
                        <div
                            className={`p-6 text-white font-extrabold text-2xl rounded-xl shadow-lg transform transition-all duration-300 ${
                                mensajeFeedback.tipo === "exito"
                                    ? "bg-green-600 ring-4 ring-green-300 animate-pulse"
                                    : "bg-red-600 ring-4 ring-red-300"
                            }`}
                        >
                            {mensajeFeedback.texto}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
