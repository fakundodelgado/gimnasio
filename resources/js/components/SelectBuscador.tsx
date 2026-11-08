import { useState, useRef, useEffect } from "react";

export interface SelectOption {
    id: number | string;
    label: string;
    sublabel?: string;
    disabled?: boolean;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: number | string | null | undefined;
    onChange: (id: number | string) => void;
    placeholder?: string;
    error?: string;
    label?: string;
}

export function SelectBuscador({
    options,
    value,
    onChange,
    placeholder = "Escriba para buscar...",
    error,
    label,
}: SearchableSelectProps) {
    const [busqueda, setBusqueda] = useState("");
    const [abierto, setAbierto] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Opción elegida actualmente (comparación segura convirtiendo a String)
    const opcionSeleccionada = options.find(
        (opt) => String(opt.id) === String(value),
    );

    // Variable derivada (Patrón del profe: filter sobre el array)
    const opcionesFiltradas = options.filter((opt) => {
        const texto = busqueda.toLowerCase();
        const coincideLabel = String(opt.label).toLowerCase().includes(texto);
        const coincideSublabel = opt.sublabel
            ? String(opt.sublabel).toLowerCase().includes(texto)
            : false;

        return coincideLabel || coincideSublabel;
    });

    // Cerrar el desplegable si el usuario hace clic afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setAbierto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const seleccionar = (opt: SelectOption) => {
        if (opt.disabled) return;
        onChange(opt.id);
        setBusqueda("");
        setAbierto(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            {/* Input principal del desplegable */}
            <div className="relative">
                <input
                    type="text"
                    placeholder={
                        opcionSeleccionada
                            ? opcionSeleccionada.label
                            : placeholder
                    }
                    value={abierto ? busqueda : opcionSeleccionada?.label || ""}
                    onFocus={() => {
                        setAbierto(true);
                        setBusqueda("");
                    }}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        if (!abierto) setAbierto(true);
                    }}
                    className={`w-full border p-2 pr-8 rounded text-sm outline-none transition focus:border-blue-500 bg-white ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => setAbierto(!abierto)}
                    className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none"
                >
                    {abierto ? "▲" : "▼"}
                </button>
            </div>

            {/* Desplegable Flotante */}
            {abierto && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg text-sm divide-y">
                    {opcionesFiltradas.length === 0 ? (
                        <li className="p-3 text-sm text-gray-500 text-center">
                            No se encontraron resultados
                        </li>
                    ) : (
                        opcionesFiltradas.map((opt) => {
                            // Definimos la variable esSeleccionado para evitar problemas de tipos (string vs number)
                            const esSeleccionado =
                                String(opt.id) === String(value);

                            return (
                                <li
                                    key={opt.id}
                                    onClick={() => seleccionar(opt)}
                                    className={`p-2.5 flex justify-between items-center transition ${
                                        opt.disabled
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : esSeleccionado
                                              ? "bg-blue-50 text-blue-700 font-semibold cursor-pointer"
                                              : "hover:bg-gray-50 text-gray-800 cursor-pointer"
                                    }`}
                                >
                                    <span>{opt.label}</span>
                                    {opt.sublabel && (
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${
                                                opt.disabled
                                                    ? "bg-red-100 text-red-600 font-bold"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {opt.sublabel}
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}

            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}
