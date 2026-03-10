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
        $criteriaField = CriteriaField::create($request->all());
        return response()->json($criteriaField, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CriteriaField $criteriaField)
    {
        return response()->json($criteriaField->load('values'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CriteriaField $criteriaField)
    {
        $criteriaField->update($request->all());
        return response()->json($criteriaField);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CriteriaField $criteriaField)
    {
        $criteriaField->delete();
        return response()->json(null, 204);
    }
}
