<?php

use App\Http\Controllers\API\CollectionController;
use App\Http\Controllers\API\CriteriaFieldController;
use App\Http\Controllers\API\JellyfishController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource("collection", CollectionController::class);

Route::apiResource("criteriafield", CriteriaFieldController::class);

Route::apiResource("jellyfish", JellyfishController::class);

Route::apiResource("location", LocationController::class);

Route::apiResource("user", UserController::class);