// src/app/api/user/changePassword/route.js
import { NextResponse } from "next/server";

// این فایل *سروری* است، نیازی به "use client" ندارد.

export async function PUT(request) {
    try {
        const body = await request.json();
        // Authorization header را از درخواست کلاینت بردار
        const auth = request.headers.get("authorization") || "";

        // حالا به سرور Holosen فچ می‌زنیم (بدون هدر Origin)
        const res = await fetch(
            "https://onlineshop.holosen.net/api/user/changePassword",
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
        // وضعیت HTTP را پاس می‌دهیم تا کلاینت بفهمد
        return NextResponse.json(
            { status: data.status, data: data.data, message: data.message },
            { status: res.status }
        );
    } catch (err) {
        console.error("Proxy changePassword error:", err);
        return NextResponse.json(
            { status: "ERROR", message: err.message || "Server error" },
            { status: 500 }
        );
    }
}
