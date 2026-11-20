import React, { useRef, useEffect, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle, LogIn } from "lucide-react";

interface CustomPageProps {
    flash?: {
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

    const handleVolver = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.get("/ingresos");
        }
    };

    useEffect(() => {
        const exito = flash.success;
        const error = flash.error || errors.client_id;

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

            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-6 px-4 sm:px-6 flex items-center justify-center">
                <div className="max-w-xl w-full mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Control de Acceso
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Terminal de marcación rápida por número de
                                socio.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleVolver}
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardContent className="p-6 sm:p-7 space-y-5 bg-white text-center">
                            <div className="space-y-1">
                                <label
                                    htmlFor="client_id"
                                    className="block text-base font-medium text-gray-700"
                                >
                                    Ingrese su ID o número de socio para
                                    ingresar
                                </label>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <input
                                        id="client_id"
                                        ref={inputRef}
                                        type="text"
                                        value={data.client_id}
                                        onChange={(e) =>
                                            setData("client_id", e.target.value)
                                        }
                                        placeholder="N° DE SOCIO / ID"
                                        disabled={processing}
                                        className="w-full text-center text-2xl sm:text-3xl font-bold py-3.5 px-4 rounded-lg border-2 border-indigo-500 bg-white text-gray-900 shadow-sm tracking-widest focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-50"
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !data.client_id}
                                    className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    {processing
                                        ? "VERIFICANDO..."
                                        : "MARCAR INGRESO"}
                                </Button>
                            </form>

                            {/* CONFIRMACIÓN VISUAL */}
                            {mensajeFeedback && (
                                <div
                                    role="alert"
                                    className={`p-5 rounded-xl border text-white font-bold text-lg sm:text-xl shadow-sm flex items-center justify-center gap-3 transition-all ${
                                        mensajeFeedback.tipo === "exito"
                                            ? "bg-emerald-600 border-emerald-700 ring-4 ring-emerald-200"
                                            : "bg-red-600 border-red-700 ring-4 ring-red-200"
                                    }`}
                                >
                                    {mensajeFeedback.tipo === "exito" ? (
                                        <CheckCircle2 className="w-7 h-7 shrink-0" />
                                    ) : (
                                        <XCircle className="w-7 h-7 shrink-0" />
                                    )}
                                    <span>{mensajeFeedback.texto}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
