<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class PagosExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected Builder $query;
    protected bool $esAdmin;
    protected int $filaActual = 1;
    protected array $filasAnuladas = [];

    public function __construct(Builder $query, bool $esAdmin)
    {
        $this->query = $query;
        $this->esAdmin = $esAdmin;
    }

    public function query(): Builder
    {
        return $this->query;
    }

    public function headings(): array
    {
        $columnas = [
            'N° Pago',
            'N° Suscripción',
            'Cliente',
            'Email',
            'Teléfono',
            'Plan',
            'Método',
            'Monto',
            'Fecha',
        ];

        if ($this->esAdmin) {
            $columnas[] = 'Empleado';
        }

        $columnas[] = 'Estado';

        return $columnas;
    }

    public function map($pago): array
    {
        $this->filaActual++;

        if ($pago->trashed()) {
            $this->filasAnuladas[] = $this->filaActual;
        }

        $fila = [
            $pago->id,
            $pago->subscription_id,
            $pago->subscription?->client?->user?->name ?? '—',
            $pago->subscription?->client?->user?->email ?? '—',
            $pago->subscription?->client?->telefono ?? '—',
            $pago->subscription?->plan?->nombre ?? '—',
            ucfirst($pago->metodo_pago),
            $pago->monto,
            $pago->fecha_pago?->format('d/m/Y') ?? $pago->fecha_pago,
        ];

        if ($this->esAdmin) {
            $fila[] = $pago->employee?->user?->name ?? 'Administración';
        }

        $fila[] = $pago->trashed() ? 'Anulado' : 'Activo';

        return $fila;
    }

    public function styles(Worksheet $sheet): array
    {
        $ultimaColumna = $sheet->getHighestColumn();
        $ultimaFila = $sheet->getHighestRow();

        // Encabezados en negrita, centrados y con fondo gris claro
        $sheet->getStyle("A1:{$ultimaColumna}1")->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E5E7EB'],
            ],
        ]);

        // Pintar de rojo suave las filas anuladas
        foreach ($this->filasAnuladas as $fila) {
            $sheet->getStyle("A{$fila}:{$ultimaColumna}{$fila}")->applyFromArray([
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FEE2E2'],
                ],
                'font' => [
                    'color' => ['rgb' => 'B91C1C'],
                ],
            ]);
        }

        // Bordes finos en toda la tabla resultante
        $sheet->getStyle("A1:{$ultimaColumna}{$ultimaFila}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        // Formato moneda en la columna H (Monto)
        if ($ultimaFila >= 2) {
            $sheet->getStyle("H2:H{$ultimaFila}")
                ->getNumberFormat()
                ->setFormatCode('"$"#,##0.00');
        }

        return [];
    }
}
