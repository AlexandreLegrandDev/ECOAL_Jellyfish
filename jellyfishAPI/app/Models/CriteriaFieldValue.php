<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CriteriaFieldValue extends Model
{
    public $timestamps = false;

    protected $guarded = [];
    use HasFactory;

    public function jellyfish() : BelongsTo
    {
        return $this->belongsTo(Jellyfish::class, 'id_jellyfish');
    }

    public function criteriaField() : BelongsTo
    {
        return $this->belongsTo(CriteriaField::class, 'id_criteria_fields');
    }
}
