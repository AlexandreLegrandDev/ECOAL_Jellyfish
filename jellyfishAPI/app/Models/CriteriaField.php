<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CriteriaField extends Model
{
    public $timestamps = false;

    protected $guarded = [];
    use HasFactory;

    public function values() : HasMany
    {
        return $this->hasMany(CriteriaFieldValue::class, 'id_criteria_fields');
    }

}
