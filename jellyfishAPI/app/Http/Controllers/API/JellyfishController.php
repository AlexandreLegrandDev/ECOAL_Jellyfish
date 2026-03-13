<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CriteriaField;
use App\Models\CriteriaFieldValue;
use App\Models\Jellyfish;
use App\Models\Collection;
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
            'depth' => 'required|integer',
            'criteria' => 'sometimes|array'
        ]);

        // enforce that the collection belongs to the authenticated user
        $collection = Collection::find($validated['id_collection']);
        $jellyfish = Jellyfish::create([
            'id_collection' => $validated['id_collection'],
            'name' => $validated['name'],
            'img' => $validated['img'],
            'depth' => $validated['depth'],
        ]);

        if (isset($validated['criteria'])) {
            foreach ($validated['criteria'] as $field => $value) {
                $criteriaField = CriteriaField::where('name', $field)->first();
                if ($criteriaField) {
                    CriteriaFieldValue::create([
                        'id_jellyfish' => $jellyfish->id,
                        'id_criteria_fields' => $criteriaField->id,
                        'value' => $value
                    ]);
                }
            }
        }

        // Auto-update collection cover image to first jellyfish's image
        $this->updateCollectionCover($validated['id_collection']);

        return response()->json($jellyfish->load('criteriaValues.criteriaField'), 201);
    }

    /**
     * After a jellyfish is created, update the collection's cover image
     * to the first jellyfish's image.
     */
    private function updateCollectionCover($collectionId)
    {
        $collection = Collection::find($collectionId);
        if (!$collection) return;

        $firstJelly = Jellyfish::where('id_collection', $collectionId)->first();
        if ($firstJelly && $firstJelly->img) {
            $collection->img = $firstJelly->img;
        } else {
            // No jellyfishes left — reset to default
            $collection->img = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg';
        }
        $collection->save();
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
            'depth' => 'integer|min:1|max:10'
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

        $collectionId = $jellyfish->id_collection;
        $jellyfish->delete();

        // Update collection cover after deletion
        $this->updateCollectionCover($collectionId);

        return response()->json(null, 204);
    }
}
