export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  vibrateIfPossible?: boolean;
  charName?: string;
  userName?: string;
}

export class NotificationManager {
  static async fire({
    title,
    body,
    icon,
    vibrateIfPossible = false,
    charName = '',
    userName = '',
  }: NotificationOptions) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (document.visibilityState === 'visible') return;

    const parseTemplate = (text: string) =>
      text
        .replace(/{{char}}/gi, charName)
        .replace(/{{user}}/gi, userName);

    const parsedTitle = parseTemplate(title);
    const parsedBody = parseTemplate(body);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(parsedTitle, { body: parsedBody, icon });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(parsedTitle, { body: parsedBody, icon });
        }
      }
    }

    if (vibrateIfPossible && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }
}
