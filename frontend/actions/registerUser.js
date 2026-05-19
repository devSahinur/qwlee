import { baseUrl } from "@/lib/constant";

export const registerUser = async (data) => {
    try {
        const res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("API call error:", error);
        throw error;
    }
};
