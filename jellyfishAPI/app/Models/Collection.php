<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Collection extends Model
{
    public $timestamps = false;

    protected $guarded = [];
    use HasFactory;

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function jellyfishes() : HasMany
    {
        return $this->hasMany(Jellyfish::class, 'id_collection');
    }
}
