<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()->orderBy('id', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search !== null) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('description', 'like', '%' . $searchTerm . '%');
            });
        }

        $paginated = $query->paginate(12);

        return response()->json([
            'data' => ServiceResource::collection($paginated),
            'meta' => [
                'pagination' => $paginated->toArray(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $service = Service::create($data);

        return new ServiceResource($service);
    }

    public function show(Service $service)
    {
        return new ServiceResource($service);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $service->update($data);

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(null, 204);
    }
}
