<?php

namespace App\Exports;

use App\Models\Payment;
//use App\Models\User;
//use GuzzleHttp\Psr7\Query;
use Illuminate\Database\Eloquent\Builder;
//use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PagosExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;
    protected $filters;
    // Recibimos los filtros validados desde el controlador
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query(): Builder
    {
        $papelera = $this->filters['papelera'];
        $orden = $this->filters['orden'];
        $direccion = $this->filters['direccion'];
        $buscar = $this->filters['buscar'];

        $query = Payment::with([
            'subscription.client' => function ($clientQuery) {
                $clientQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            },
            'subscription.plan',
            'employee' => function ($empQuery) {
                $empQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            }
        ]);

        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        $query->when($buscar !== '', function ($q) use ($buscar, $papelera) {
            $q->where(function ($subQ) use ($buscar, $papelera) {

                if (is_numeric($buscar)) {
                    $subQ->where('payments.id', $buscar)
                        ->orWhere('payments.subscription_id', $buscar);
                }

                $subQ->orWhereHas('subscription.client', function ($clientQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $clientQuery->withTrashed();
                    }
                    $clientQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });

                $subQ->orWhereHas('employee', function ($empQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $empQuery->withTrashed();
                    }
                    $empQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });
            });
        });

        $query->orderBy("payments.{$orden}", $direccion)->orderBy('id', 'desc');

        return $query;
    }


    // Definimos las columnas que tendrá el Excel
    public function headings(): array
    {
        return [
            'Numero',
            'Cliente',
            'Plan',
            'Monto',
            'Fecha',
            'Empleado',
        ];
    }

    // Mapeamos los datos de cada Carrera.
    // $carrera ya trae cargadas sus materias gracias al Eager Loading (with)
    public function map($pago): array
    {
        // Transformamos la colección de materias a un string separado por comas
        return [
            $pago->id,
            $pago->subscription->client->user->name,
            $pago->subscription->plan->nombre,
            $pago->monto,
            $pago->fecha_pago,
            $pago->employee->user->name,
        ];
    }
}
