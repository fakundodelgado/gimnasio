import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props as any;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isSuccess = !!flash.success;
    const message = flash.success || flash.error;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-fade-in-up">
            <div className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 transition-all duration-300 ${
                isSuccess
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
            }`}>
                <div className="flex-shrink-0 mt-0.5">
                    {isSuccess ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {isSuccess ? '¡Operación exitosa!' : 'Hubo un problema'}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isSuccess
                            ? 'hover:bg-green-100 text-green-500 focus:ring-green-500 focus:ring-offset-green-50'
                            : 'hover:bg-red-100 text-red-500 focus:ring-red-500 focus:ring-offset-red-50'
                    }`}
                    aria-label="Cerrar notificación"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}