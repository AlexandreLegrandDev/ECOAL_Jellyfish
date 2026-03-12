<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Jellyfish;
use Illuminate\Http\Request;

class JellyfishController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jellyfishes = Jellyfish::with(['collection', 'location', 'criteriaValues.criteriaField'])
            ->whereHas('collection', function ($query) {
                $query->where('status', 0)->orderBy('depth', 'ASC');
            })
            ->get();

        return response()->json($jellyfishes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_collection' => 'required|exists:collections,id',
            'name' => 'required|string|max:255',
            'img' => 'required|string',
            'depth' => 'required|integer|min:1|max:5'
        ]);

        // Check if the collection belongs to the authenticated user
        // $collection = \App\Models\Collection::find($validated['id_collection']);
        // if ($collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $jellyfish = Jellyfish::create($validated);

        return response()->json($jellyfish, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Jellyfish $jellyfish)
    {
        return response()->json($jellyfish->load(['collection', 'location', 'criteriaValues.criteriaField']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jellyfish $jellyfish)
    {
        // Check if the jellyfish's collection belongs to the authenticated user
        // if ($jellyfish->collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'img' => 'string',
            'depth' => 'integer|min:1|max:5'
        ]);

        $jellyfish->update($validated);

        return response()->json($jellyfish);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jellyfish $jellyfish)
    {
        // Check if the jellyfish's collection belongs to the authenticated user
        // if ($jellyfish->collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $jellyfish->delete();

        return response()->json(null, 204);
    }
}
