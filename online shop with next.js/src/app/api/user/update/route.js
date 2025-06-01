// src/app/api/user/update/route.js
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const body = await request.json();
        const auth = request.headers.get("authorization") || "";

        const res = await fetch(
            "https://onlineshop.holosen.net/api/user/update",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: auth,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await res.json();
        return NextResponse.json(
            { status: data.status, data: data.data, message: data.message },
            { status: res.status }
        );
    } catch (err) {
        console.error("Proxy editProfile error:", err);
        return NextResponse.json(
            { status: "ERROR", message: err.message || "Server error" },
            { status: 500 }
        );
    }
}
