// src/hooks/useLogoSrc.js
"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to return logo image path based on current theme (light/dark).
 */
export default function useLogoSrc() {
    const [logoSrc, setLogoSrc] = useState("/light.PNG");

    useEffect(() => {
        // Function to update logo path based on html.dark class
        const updateLogo = () => {
            const isDark = document.documentElement.classList.contains("dark");
            setLogoSrc(isDark ? "/dark.PNG" : "/light.PNG");
        };

        // Initial check
        updateLogo();

        // Observe class changes on html for real-time update
        const observer = new MutationObserver(updateLogo);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return logoSrc;
}
