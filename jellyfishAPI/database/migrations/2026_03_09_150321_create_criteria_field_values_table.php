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
        Schema::create('criteria_field_values', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_jellyfish')->constrained('jellyfishes')->onDelete('cascade');
            
            $table->foreignId("id_criteria_fields")->constrained("criteria_fields")->onDelete("cascade");

            $table->integer("value");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criteria_field_values');
    }
};
