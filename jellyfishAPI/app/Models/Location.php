<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Location extends Model
{
    public $timestamps = false;

    protected $guarded = [];
    use HasFactory;

    public function jellyfish() : BelongsTo
    {
        return $this->belongsTo(Jellyfish::class, 'id_jellyfish');
    }

}