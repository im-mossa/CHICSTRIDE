// src/app/api/user/update/route.js
import { NextResponse } from "next/server";

const API_URL = "https://onlineshop.holosen.net/api/user/update";

export async function PUT(request) {
    try {
        // Read incoming request body
        const payload = await request.json();

        // Forward Authorization header if present
        const authHeader = request.headers.get("authorization") ?? "";

        // Proxy the PUT request to the external API
        const apiResponse = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify(payload),
        });

        // Parse API response
        const { status: apiStatus, data, message } = await apiResponse.json();

        // Return structured JSON with original status code
        return NextResponse.json(
            { status: apiStatus, data, message },
            { status: apiResponse.status }
        );
    } catch (error) {
        console.error("Proxy /api/user/update error:", error);
        // On unexpected error, return 500
        return NextResponse.json(
            { status: "ERROR", message: error?.message ?? "Server error" },
            { status: 500 }
        );
    }
}
