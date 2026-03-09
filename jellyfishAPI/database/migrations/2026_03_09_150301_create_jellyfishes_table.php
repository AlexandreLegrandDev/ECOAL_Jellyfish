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
            $table->integer("id_user");
            $table->foreign('id_user')->references("id_user")->on("collection");

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
