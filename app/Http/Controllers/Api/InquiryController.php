<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInquiryRequest;
use App\Http\Resources\InquiryResource;
use App\Models\Inquiry;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Inquiry::query()->orderBy('updated_at', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // Count all inquiries by status (ignores pagination)
        $counts = [
            'total' => Inquiry::count(),
            'pending' => Inquiry::where('status', 'pending')->count(),
            'approved' => Inquiry::where('status', 'approved')->count(),
            'rejected' => Inquiry::where('status', 'rejected')->count(),
            'waitlisted' => Inquiry::where('status', 'waitlisted')->count(),
            'archived' => Inquiry::where('status', 'archive')->count(),

            'this_month_total' => Inquiry::whereDate('created_at', '>=', $startOfMonth)->count(),
            'today_approved' => Inquiry::where('status', 'approved')->whereDate('updated_at', $today)->count(),
            'today_rejected' => Inquiry::where('status', 'rejected')->whereDate('updated_at', $today)->count(),
        ];

        if ($request->has('search') && $request->search !== null) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('user_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('user_email', 'like', '%' . $searchTerm . '%');
            });
        }

        $paginated = $query->paginate(20);

        return response()->json([
            'data' => InquiryResource::collection($paginated),
            'meta' => [
                'pagination' => $paginated->toArray(),
            ],
            'counts' => $counts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'user_name' => 'required|string',
            'user_email' => 'required|email',
            'user_contact_number' => 'nullable|string',
            'vehicle_desc' => 'required|string',
            'plate_number' => 'required|string',
            'set_date' => '',
            'set_time' => '',
            'inquiry' => 'required|string',
            'status' => 'required|string',
        ]);

        $inquiry = Inquiry::create($validated);

        return response()->json([
            'message' => 'Inquiry submitted successfully.',
            'data' => $inquiry
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        return new InquiryResource($inquiry);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInquiryRequest $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update($request->validated());

        return response()->json([
            'message' => 'Inquiry updated successfully.',
            'data' => $inquiry,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        return response("", 204);
    }
}
