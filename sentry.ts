import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://0335d11be39c3c075ef8f5f37e5823ac@o4509146218299392.ingest.us.sentry.io/4509214976770048",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  environment: "production",
});
