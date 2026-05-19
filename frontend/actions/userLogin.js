import { baseUrl } from "@/lib/constant";

export const userLogin = async (data) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const result = await res.json();
    
    
    return result;
}
