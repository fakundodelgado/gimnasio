<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Pagos registrados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }
    </style>
</head>

<body>
    <h1>Pagos registrados</h1>
    <table>
        <thead>
            <tr>Numero</tr>
            <tr>Cliente</tr>
            <tr>Plan</tr>
            <tr>Empleado</tr>
            <tr>Fecha</tr>
            <tr>Monto</tr>
        </thead>
        <tbody>
            @forelse ($pagos as $pago)
            <tr>
                <td>#{{ $pago->id }}</td>
                <td>{{ $pago->subscription->client->user->name ?? 'N/A' }}</td>
                <td>{{ $pago->subscription->plan->nombre ?? 'N/A' }}</td>
                <td>{{ $pago->employee->user->name ?? 'Administración' }}</td>
                <td>{{ \Carbon\Carbon::parse($pago->fecha_pago)->format('d/m/Y') }}</td>
                <td style="text-align: right;">${{ number_format($pago->monto, 2, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">No hay pagos registrados.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>

</html>