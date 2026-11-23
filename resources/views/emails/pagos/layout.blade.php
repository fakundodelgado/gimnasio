<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de Pago</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; width: 100% !important;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 12px;">
        <tr>
            <td align="center">
                <!-- Contenedor Principal -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
                    
                    <!-- Franja superior de color institucional -->
                    <tr>
                        <td style="height: 5px; background-color: #2563eb; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Encabezado con Logo -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 28px 32px 20px 32px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                            <img 
                                src="{{ isset($message) ? $message->embed(public_path('imagenes/logo.png')) : asset('imagenes/logo.png') }}" 
                                alt="Logo Gimnasio" 
                                style="width: 72px; height: auto; display: block; margin: 0 auto 14px auto;"
                            >
                            <h1 style="margin: 0; color: #111827; font-size: 20px; font-weight: 700; letter-spacing: -0.2px;">
                                Comprobante de Pago
                            </h1>
                            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">
                                {{ config('app.name', 'Gimnasio') }}
                            </p>
                        </td>
                    </tr>

                    <!-- Contenido Dinámico -->
                    <tr>
                        <td style="padding: 28px 32px; color: #374151; font-size: 15px; line-height: 1.6;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Pie de página -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 18px 32px; text-align: center; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                            Este es un correo generado automáticamente por <strong>{{ config('app.name', 'Gimnasio') }}</strong>.<br>
                            Por favor, no respondas a este mensaje.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>