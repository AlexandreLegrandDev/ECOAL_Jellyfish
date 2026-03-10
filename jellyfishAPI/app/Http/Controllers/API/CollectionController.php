<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Collection::with(['user', 'jellyfishes'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'img' => 'required|string',
            'status' => 'required|boolean'
        ]);

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
        $collections = Collection::with(['jellyfishes'])->inRandomOrder()->limit(4)->get();

        return response()->json($collections);
    }
}
