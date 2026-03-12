<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('collection')->get()->map(function($u){
            if ($u->avatar) {
                $u->avatar = url("/storage/{$u->avatar}");
            }
            return $u;
        });
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('collection');
        if ($user->avatar) {
            $user->avatar = url("/storage/{$user->avatar}");
        }
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $user->update($request->only(['name','email','avatar']));

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    public function getUsersCollections(User $user) {
        $collections = $user->collection()->get();

        return response()->json($collections);
    }
}
