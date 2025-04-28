import React from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { VITE_PUBLIC_POSTHOG_KEY } from "~/config";

interface Props {
    children: React.ReactNode;
}

export default function PostHogProvider({ children }: Props) {
    return (
        <PHProvider
            apiKey={VITE_PUBLIC_POSTHOG_KEY}
            options={{
                api_host: "https://us.i.posthog.com",
                debug: import.meta.env.MODE === "development",
            }}
        >
            {children}
        </PHProvider>
    );
}
