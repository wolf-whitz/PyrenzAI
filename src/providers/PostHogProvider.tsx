import React from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

interface Props {
    children: React.ReactNode;
}

const PostHogProvider: React.FC<Props> = ({ children }) => {
    return (
        <PHProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={{
                api_host: "https://us.i.posthog.com",
                debug: import.meta.env.MODE === "development",
            }}
        >
            {children}
        </PHProvider>
    );
};

export default PostHogProvider;
