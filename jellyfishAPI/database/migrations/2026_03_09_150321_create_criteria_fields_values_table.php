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
        Schema::create('criteria_fields_values', function (Blueprint $table) {
            $table->id();
            $table->integer('id_jellyfish');
            $table->foreign("id_jellyfish")->references("id")->on("jellyfishes");
            
            $table->integer("id_criteria_fields");
            $table->foreign("id_criteria_fields")->references("id")->on("criteria_fields");

            $table->integer("value");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criteria_fields_values');
    }
};
