<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Pagos registrados</title>
    <style>
        @page {
            size: a4 landscape;
            margin: 12mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #111827;
        }

        h1 {
            text-align: center;
            margin-bottom: 4px;
            font-size: 16px;
        }

        .subtitulo {
            text-align: center;
            font-size: 9px;
            color: #4b5563;
            margin-bottom: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background-color: #f3f4f6;
            font-weight: bold;
        }

        th,
        td {
            border: 1px solid #374151;
            padding: 5px;
            text-align: left;
            word-wrap: break-word;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .anulado {
            color: #b91c1c;
            font-size: 8px;
            font-weight: bold;
        }

        tfoot td {
            font-weight: bold;
            background-color: #f9fafb;
        }
    </style>
</head>

<body>
    <h1>Historial de Pagos Registrados</h1>
    <div class="subtitulo">
        Generado el {{ now()->format('d/m/Y H:i') }}
        @if (!empty($filtros['desde']) || !empty($filtros['hasta']))
            · Período:
            {{ !empty($filtros['desde']) ? \Carbon\Carbon::parse($filtros['desde'])->format('d/m/Y') : 'Inicio' }}
            al
            {{ !empty($filtros['hasta']) ? \Carbon\Carbon::parse($filtros['hasta'])->format('d/m/Y') : 'Actualidad' }}
        @endif
        @if (!empty($filtros['metodo']))
            · Método: {{ ucfirst($filtros['metodo']) }}
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>N° Pago</th>
                <th>N° Suscripción</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Plan</th>
                <th>Método</th>
                <th class="text-right">Monto</th>
                <th>Fecha</th>
                @if ($esAdmin)
                    <th>Empleado</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @forelse ($pagos as $pago)
                <tr>
                    <td>
                        #{{ $pago->id }}
                        @if ($pago->deleted_at)
                            <div class="anulado">ANULADO</div>
                        @endif
                    </td>
                    <td>#{{ $pago->subscription_id }}</td>
                    <td>{{ $pago->subscription?->client?->user?->name ?? '—' }}</td>
                    <td>{{ $pago->subscription?->client?->user?->email ?? '—' }}</td>
                    <td>{{ $pago->subscription?->client?->telefono ?? '—' }}</td>
                    <td>{{ $pago->subscription?->plan?->nombre ?? '—' }}</td>
                    <td>{{ ucfirst($pago->metodo_pago) }}</td>
                    <td class="text-right">${{ number_format($pago->monto, 2, ',', '.') }}</td>
                    <td>{{ \Carbon\Carbon::parse($pago->fecha_pago)->format('d/m/Y') }}</td>
                    @if ($esAdmin)
                        <td>{{ $pago->employee?->user?->name ?? 'Administración' }}</td>
                    @endif
                </tr>
            @empty
                <tr>
                    <td colspan="{{ $esAdmin ? 10 : 9 }}" class="text-center">
                        No hay pagos registrados para los filtros seleccionados.
                    </td>
                </tr>
            @endforelse
        </tbody>
        @if ($pagos->count() > 0)
            <tfoot>
                <tr>
                    <td colspan="{{ $esAdmin ? 9 : 8 }}" class="text-right">
                        Total ({{ $pagos->count() }} {{ $pagos->count() === 1 ? 'pago' : 'pagos' }}):
                    </td>
                    <td class="text-right">
                        ${{ number_format($pagos->sum('monto'), 2, ',', '.') }}
                    </td>
                </tr>
            </tfoot>
        @endif
    </table>
</body>

</html>