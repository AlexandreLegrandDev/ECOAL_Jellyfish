<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CollectionController;
use App\Http\Controllers\API\CriteriaFieldController;
use App\Http\Controllers\API\JellyfishController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// convenience route that returns the currently authenticated user
Route::middleware('auth:sanctum')->get('/user/me', function (Illuminate\Http\Request $request) {
    $user = $request->user();
    if ($user->avatar && !\Illuminate\Support\Str::startsWith($user->avatar, ['http://', 'https://'])) {
        $user->avatar = url("/storage/{$user->avatar}");
    }
    return response()->json($user);
});

// Public routes (GET)
Route::get('/collection', [CollectionController::class, 'index']);
Route::get('/collection/{collection}', [CollectionController::class, 'show']);
Route::get('/random', [CollectionController::class, 'random']);


Route::get('/criteriafield', [CriteriaFieldController::class, 'index']);
Route::get('/criteriafield/{criteriafield}', [CriteriaFieldController::class, 'show']);

Route::get('/jellyfish', [JellyfishController::class, 'index']);
Route::get('/jellyfish/{jellyfish}', [JellyfishController::class, 'show']);

Route::get('/location', [LocationController::class, 'index']);
Route::get('/location/{location}', [LocationController::class, 'show']);

// Protected routes (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Collections (create/update/delete only if authenticated)
    Route::post('/collection', [CollectionController::class, 'store']);
    Route::put('/collection/{collection}', [CollectionController::class, 'update']);
    Route::delete('/collection/{collection}', [CollectionController::class, 'destroy']);

    // Jellyfish (user can only create/update/delete its own jellyfish)
    Route::post('/jellyfish', [JellyfishController::class, 'store']);
    Route::put('/jellyfish/{jellyfish}', [JellyfishController::class, 'update']);
    Route::delete('/jellyfish/{jellyfish}', [JellyfishController::class, 'destroy']);

    // Locations (only create/update/delete if authenticated)
    Route::post('/location', [LocationController::class, 'store']);
    Route::put('/location/{location}', [LocationController::class, 'update']);
    Route::delete('/location/{location}', [LocationController::class, 'destroy']);

    // CriteriaField Values (user can only manage values for their own jellyfish)
    Route::post('/criteriafield/value', [CriteriaFieldController::class, 'storeValue']);
    Route::put('/criteriafield/value/{criteriaFieldValue}', [CriteriaFieldController::class, 'updateValue']);
    Route::delete('/criteriafield/value/{criteriaFieldValue}', [CriteriaFieldController::class, 'destroyValue']);

    // USER
    Route::get("/user/{user}/collection", [UserController::class, 'getUsersCollections']);
    Route::apiResource("user", UserController::class);
    Route::middleware('auth:sanctum')->put('/user', [UserController::class, 'update']);

});
