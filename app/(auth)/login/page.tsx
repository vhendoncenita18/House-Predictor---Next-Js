import { Suspense } from "react";

import LoginPage from "@/components/login";

export default function Login() {
    return(
        <Suspense fallback={null}>
            <LoginPage />
        </Suspense>
    )   
}
