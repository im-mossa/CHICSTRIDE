// src/app/api/user/changePassword/route.js
import { NextResponse } from "next/server";

const API_URL = "https://onlineshop.holosen.net/api/user/changePassword";

export async function PUT(request) {
    try {
        // بدنه‌ی JSON را بخوان
        const payload = await request.json();

        // هدر Authorization را از کلاینت بگیر
        const authHeader = request.headers.get("authorization") ?? "";

        // درخواست به API خارجی
        const apiResponse = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify(payload),
        });

        // پاسخ API را به JSON تبدیل کن
        const { status: apiStatus, data, message } = await apiResponse.json();

        // نتیجه را با همان کد وضعیت HTTP برگردان
        return NextResponse.json(
            { status: apiStatus, data, message },
            { status: apiResponse.status }
        );
    } catch (error) {
        console.error("Proxy changePassword error:", error);
        return NextResponse.json(
            { status: "ERROR", message: error.message ?? "Server error" },
            { status: 500 }
        );
    }
}
