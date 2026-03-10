<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CriteriaField;
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
}
