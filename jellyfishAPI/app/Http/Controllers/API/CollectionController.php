<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Collection::with(['user', 'jellyfishes'])->where('status', '=', '0')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'img' => 'required|string',
            'status' => 'required|boolean'
        ]);

        $userID = Auth::id();

        if (Collection::where('id_user', $userID)->exists()) {
            return response()->json([
                'error' => 'User already has a collection'
            ], 409);
        }

        $collection = Collection::create($validated);

        return response()->json($collection, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Collection $collection)
    {
        return response()->json($collection->load(['user', 'jellyfishes']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'img' => 'string',
            'status' => 'boolean'
        ]);

        $collection->update($validated);

        return response()->json($collection);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection)
    {
        $collection->delete();

        return response()->json(null, 204);

    }

    public function random()
    {
        $collections = Collection::with(['jellyfishes'])
            ->where('status', '=', '0')
            ->inRandomOrder()
            ->limit(2)
            ->get();

        return response()->json($collections);
    }
}
