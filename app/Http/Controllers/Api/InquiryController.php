<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInquiryRequest;
use App\Http\Resources\InquiryResource;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InquiryResource::collection(
            Inquiry::query()->orderBy('id', 'desc')->paginate(10)
        );
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
