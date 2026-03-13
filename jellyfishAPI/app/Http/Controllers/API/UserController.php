<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('collection')->get()->map(function($u){
            if ($u->avatar && !\Illuminate\Support\Str::startsWith($u->avatar, ['http://','https://'])) {
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
        if ($user->avatar && !\Illuminate\Support\Str::startsWith($user->avatar, ['http://','https://'])) {
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

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'avatar' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            // strip domain if accidentally stored
            $path = preg_replace('#^https?://[^/]+/storage/#', '', $path);
            $user->avatar = $path;
        }

        $user->name = $request->name;
        $user->email = $request->email;

        $user->save();

        // prepare avatar url for response
        if ($user->avatar && !\Illuminate\Support\Str::startsWith($user->avatar, ['http://','https://'])) {
            $user->avatar = url("/storage/{$user->avatar}");
        }

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
