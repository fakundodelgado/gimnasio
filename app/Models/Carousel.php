<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $table = 'carousel';

    protected $fillable = ['image_url', 'title', 'description', 'priority'];
}
