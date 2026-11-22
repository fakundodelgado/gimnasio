<?php

namespace Database\Seeders;

use App\Models\Carousel;
use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'image_url' => '/imagenes/carousel/gym1.png',
                'title' => 'Equipamiento de Primer Nivel',
                'description' => 'Sala de musculación y peso libre equipada para todos los niveles.',
                'priority' => 1,
            ],
            [
                'image_url' => 'imagenes/carousel/gym2.png',
                'title' => 'Entrenamiento Personalizado',
                'description' => 'Seguimiento profesional adaptado a tus objetivos.',
                'priority' => 2,
            ],
            [
                'image_url' => '/imagenes/carousel/gym3.png',
                'title' => 'Control y Seguimiento',
                'description' => 'Seguimiento online de tu suscripcion y pagos.',
                'priority' => 3,
            ],
        ];

        foreach ($slides as $slide) {
            Carousel::updateOrCreate(
                ['image_url' => $slide['image_url']],
                $slide
            );
        }
    }
}
