<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CriteriaField;
use App\Models\CriteriaFieldValue;
use Illuminate\Http\Request;

class CriteriaFieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(CriteriaField::with('values')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
            'name' => 'required|string|unique:criteria_fields|max:255'
        ]);

        $criteria = CriteriaField::create($validated);

        return response()->json($criteria, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CriteriaField $criteriafield)
    {
        return response()->json($criteriafield->load('values'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CriteriaField $criteriafield)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:criteria_fields,name,' . $criteriafield->id
        ]);
        
        $criteriafield->update($validated);

        return response()->json($criteriafield);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CriteriaField $criteriafield)
    {
        $criteriafield->delete();
        return response()->json(null, 204);
    }

    public function storeValue(Request $request)
    {
        $validated = $request->validate([
            'id_jellyfish' => 'required|exists:jellyfishes,id',
            'id_criteria_fields' => 'required|exists:criteria_fields,id',
            'value' => 'required|integer'
        ]);

        // Check if the jellyfish belongs to the authenticated user
        // $jellyfish = Jellyfish::find($validated['id_jellyfish']);
        // if ($jellyfish->collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $criteriaValue = CriteriaFieldValue::create($validated);

        return response()->json($criteriaValue, 201);
    }

    public function updateValue(Request $request, CriteriaFieldValue $criteriaFieldValue)
    {
        // Check if the jellyfish belongs to the authenticated user
        // if ($criteriaFieldValue->jellyfish->collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'value' => 'required|integer'
        ]);

        $criteriaFieldValue->update($validated);

        return response()->json($criteriaFieldValue);
    }

    public function destroyValue(CriteriaFieldValue $criteriaFieldValue)
    {
        // Check if the jellyfish belongs to the authenticated user
        // if ($criteriaFieldValue->jellyfish->collection->id_user !== auth()->id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $criteriaFieldValue->delete();

        return response()->json(null, 204);
    }
}
