import { Head, Link } from "@inertiajs/react";
import { login, register } from "@/routes";
import Carousel, { Imagen } from "@/components/carousel";
import { Check, Calendar, UserCheck, Clock, MapPin, Phone } from "lucide-react";

interface Plan {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion?: number;
    incluye_entrenador?: boolean;
}

interface WelcomeProps {
    imagenes?: Imagen[];
    planes?: Plan[];
}

export default function Welcome({ imagenes = [], planes = [] }: WelcomeProps) {
    return (
        <>
            <Head title="Inicio - Gimnasio" />

            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center h-full py-1"
                        >
                            <img
                                src="/imagenes/logo-2.png"
                                alt="Logo Gimnasio"
                                className="h-full w-auto object-contain"
                            />
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a
                                href="#inicio"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Inicio
                            </a>
                            <a
                                href="#planes"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Planes
                            </a>
                            <a
                                href="#contacto"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Horarios y Contacto
                            </a>
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href={login()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={register()}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1">
                    {/* 2. SECCIÓN HERO + SLIDER DINÁMICO */}
                    <section
                        id="inicio"
                        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                            {/* Columna izquierda: Presentación y llamados a la acción */}
                            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    Entrenamiento &amp; Gestión Integral
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                    Alcanzá tus objetivos con seguimiento
                                    profesional
                                </h1>
                                <p className="text-gray-600 text-base leading-relaxed">
                                    Accedé a planes flexibles de musculación y
                                    entrenamiento personalizado. Si ya sos
                                    socio, ingresá al sistema para consultar tu
                                    suscripción, historial de pagos, consultar
                                    otros planes o consultar entrenadores
                                    disponibles.
                                </p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                                    <Link
                                        href={login()}
                                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                    <a
                                        href="#planes"
                                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Ver planes
                                    </a>
                                </div>
                            </div>

                            {/* Columna derecha: Slider dinámico desde BD */}
                            <div className="lg:col-span-7">
                                {imagenes.length > 0 ? (
                                    <Carousel
                                        imagenes={imagenes}
                                        autoPlay={true}
                                        interval={4000}
                                        pauseOnHover={true}
                                    />
                                ) : (
                                    <div className="h-64 sm:h-80 md:h-105 rounded-2xl border border-dashed border-gray-300 bg-white flex items-center justify-center text-sm text-gray-400">
                                        Agregá imágenes en public/carousel y
                                        ejecutá CarouselSeeder
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                    {/* 3. SECCIÓN PLANES DISPONIBLES */}
                    <section
                        id="planes"
                        className="bg-white border-y border-gray-200 py-14 lg:py-20"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            {/* Encabezado de sección */}
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3">
                                    Planes
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                                    Planes pensados para tu ritmo
                                </h2>
                                <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                    Elegí la opción que mejor se adapte a tus
                                    objetivos. Todos nuestros planes incluyen
                                    acceso completo a la sala de musculación y
                                    seguimiento desde el portal.
                                </p>
                            </div>

                            {/* Grilla dinámica de planes */}
                            {planes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {planes.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50/60 p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
                                        >
                                            <div>
                                                {/* Etiqueta superior según modalidad */}
                                                <div className="flex items-center justify-between gap-2 mb-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            plan.incluye_entrenador
                                                                ? "bg-indigo-100 text-indigo-700"
                                                                : "bg-gray-200/80 text-gray-700"
                                                        }`}
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5" />
                                                        {plan.incluye_entrenador
                                                            ? "Con entrenador"
                                                            : "Pase libre"}
                                                    </span>

                                                    {plan.duracion && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {plan.duracion} días
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Nombre y precio */}
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {plan.nombre}
                                                </h3>

                                                <div className="mt-3 flex items-baseline gap-1">
                                                    <span className="text-3xl font-extrabold text-gray-900">
                                                        $
                                                        {Number(
                                                            plan.precio,
                                                        ).toLocaleString(
                                                            "es-AR",
                                                        )}
                                                    </span>
                                                    {plan.duracion && (
                                                        <span className="text-sm text-gray-500">
                                                            / {plan.duracion}{" "}
                                                            días
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Descripción */}
                                                {plan.descripcion && (
                                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                                        {plan.descripcion}
                                                    </p>
                                                )}

                                                {/* Beneficios base */}
                                                <ul className="mt-5 space-y-2.5 border-t border-gray-200 pt-5 text-sm text-gray-600">
                                                    <li className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                                                        <span>
                                                            Acceso libre a sala
                                                            de musculación
                                                        </span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                                                        <span>
                                                            Historial de
                                                            suscripciones y
                                                            pagos en la web
                                                        </span>
                                                    </li>
                                                    {plan.incluye_entrenador && (
                                                        <li className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                                                            <span>
                                                                Rutina y
                                                                seguimiento
                                                                personalizado
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>

                                            {/* Botón de acción */}
                                            <div className="mt-6 pt-4">
                                                <Link
                                                    href={register()}
                                                    className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                                >
                                                    Empezar ahora
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
                                    Actualmente no hay planes publicados.
                                    Consultá en recepción para más información.
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* 4. PIE DE PÁGINA (FOOTER) */}
                <footer
                    id="contacto"
                    className="bg-gray-50 border-t border-gray-200"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Columna 1: Marca */}
                            <div className="flex flex-col items-center text-center space-y-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center h-10"
                                >
                                    <img
                                        src="/imagenes/logo-2.png"
                                        alt="Logo Gimnasio"
                                        className="h-full w-auto object-contain"
                                    />
                                </Link>
                                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                                    Historial de suscripciones y pagos online.
                                </p>
                            </div>

                            {/* Columna 2: Horarios */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                                    Horarios de atención
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>
                                            Lunes a Viernes: 07:00 a 22:00 hs
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Sábados: 09:00 a 14:00 hs</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Columna 3: Ubicación y contacto */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                                    Contacto
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Av. Principal 1234, Salta</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>(387) 400-0000</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Barra inferior de copyright */}
                        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                            <p>
                                &copy; {new Date().getFullYear()} Sistema de
                                Gestión de Gimnasio. Todos los derechos
                                reservados.
                            </p>
                            <div className="flex items-center gap-4">
                                <a
                                    href="#inicio"
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    Volver arriba
                                </a>
                                <Link
                                    href={login()}
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    Acceso al sistema
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
