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
        return response()->json(Jellyfish::with(['collection', 'location', 'criteriaValues.criteriaField'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $jellyfish = Jellyfish::create($request->all());
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
        $jellyfish->update($request->all());
        return response()->json($jellyfish);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jellyfish $jellyfish)
    {
        $jellyfish->delete();
        return response()->json(null, 204);
    }
}
