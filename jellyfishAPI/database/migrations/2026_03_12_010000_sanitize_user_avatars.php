<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // remove any full-url prefix from avatar column
        DB::table('users')->get(['id','avatar'])->each(function ($u) {
            if ($u->avatar && preg_match('#^https?://[^/]+/storage/(.+)$#', $u->avatar, $m)) {
                DB::table('users')->where('id', $u->id)->update(['avatar' => $m[1]]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // no-op
    }
};