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
        Schema::create('jellyfishes', function (Blueprint $table) {
            $table->id();

            $table->foreignId("id_collection")->constrained("collections")->onDelete("cascade");

            $table->string("name");
            $table->string('img');
            $table->integer("depth");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jellyfishes');
    }
};
