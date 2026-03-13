<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jellyfishes', function (Blueprint $table) {
            // change img column to text so it can hold long base64 strings
            $table->text('img')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jellyfishes', function (Blueprint $table) {
            $table->string('img')->change();
        });
    }
};
