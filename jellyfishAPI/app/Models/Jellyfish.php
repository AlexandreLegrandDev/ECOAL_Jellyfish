<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jellyfish extends Model
{
    public $timestamps = false;

    protected $guarded = [];
    use HasFactory;


    public function collection() : BelongsTo
    {
        return $this->belongsTo(Collection::class, 'id_collection');
    }

    public function criteriaValues() : HasMany
    {
        return $this->hasMany(CriteriaFieldValue::class, 'id_jellyfish');
    }

    public function location() : HasMany
    {
        return $this->hasMany(Location::class, 'id_jellyfish');
    }
}
