import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Imagen {
    id: number;
    image_url: string;
    title: string;
    description: string;
}

interface CarouselProps {
    imagenes: Imagen[];
    autoPlay?: boolean;
    interval?: number;
    pauseOnHover?: boolean;
}

export default function Carousel({
    imagenes,
    autoPlay = true,
    interval = 4000,
    pauseOnHover = true,
}: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const next = useCallback((): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, [imagenes.length]);

    const prev = (): void => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length,
        );
    };

    useEffect(() => {
        if (!autoPlay || isPaused || imagenes.length <= 1) return;
        const timer = setInterval(next, interval);
        return () => clearInterval(timer);
    }, [autoPlay, isPaused, interval, next, imagenes.length]);

    if (!imagenes || imagenes.length === 0) return null;

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm"
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {/* Contenedor de imágenes */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {imagenes.map((imagen, i) => (
                    <div
                        key={imagen.id ?? i}
                        className="relative w-full shrink-0"
                    >
                        <img
                            src={`/${imagen.image_url.replace(/^\//, "")}`}
                            loading={i === 0 ? "eager" : "lazy"}
                            className="w-full object-cover h-64 sm:h-80 md:h-105"
                            alt={imagen.title || `Slide ${i + 1}`}
                        />
                        {/* Degradado inferior con título y descripción */}
                        {(imagen.title || imagen.description) && (
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 pb-10 text-white">
                                {imagen.title && (
                                    <h3 className="text-lg sm:text-xl font-semibold">
                                        {imagen.title}
                                    </h3>
                                )}
                                {imagen.description && (
                                    <p className="mt-1 text-xs sm:text-sm text-gray-200">
                                        {imagen.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botones de navegación */}
            {imagenes.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors cursor-pointer"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors cursor-pointer"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Indicadores inferiores */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                        {imagenes.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === currentIndex
                                        ? "w-6 bg-white"
                                        : "w-2.5 bg-white/50"
                                }`}
                                aria-label={`Ir a imagen ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
