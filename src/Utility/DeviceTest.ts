import Bowser from 'bowser';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface FingerprintJSComponent {
  value: any;
  error?: unknown;
  duration?: number;
}

interface FingerprintJSResult {
  visitorId: string;
  components: {
    [key: string]: FingerprintJSComponent | undefined;
    screenResolution: FingerprintJSComponent;
    fonts: FingerprintJSComponent;
    timezone: FingerprintJSComponent;
    languages: FingerprintJSComponent;
    plugins: FingerprintJSComponent;
    userAgent?: FingerprintJSComponent;
    touchSupport: FingerprintJSComponent;
  };
}

export const DeviceTest = async () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          const syncReg = registration as ServiceWorkerRegistration & {
            sync: { register: (tag: string) => Promise<void> };
          };
          if ('sync' in syncReg) {
            try {
              await syncReg.sync.register('retry-post');
            } catch (error) {
              console.error('Sync registration failed:', error);
            }
          }
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }

  const isOldBrowser = (): boolean => {
    switch (true) {
      case typeof Promise === 'undefined':
      case typeof fetch !== 'function':
      case typeof Object.assign !== 'function':
      case typeof Array.prototype.includes !== 'function':
        return true;
      default:
        return false;
    }
  };

  if (isOldBrowser()) {
    return false;
  }

  try {
    const fp = await FingerprintJS.load().then((fp) => fp.get());
    const { visitorId, components } = fp as FingerprintJSResult;
    localStorage.setItem('visitorId', visitorId);

    const userAgentValue = components.userAgent?.value || navigator.userAgent;
    const browser = Bowser.getParser(userAgentValue).getResult();

    const resp = await fetch('https://ipapi.co/json/');
    const ipData = await resp.json();

    const detailedInfo = {
      visitorId,
      components: {
        screenResolution: components.screenResolution.value,
        fonts: components.fonts.value,
        timezone: components.timezone.value,
        languages: components.languages.value,
        plugins: components.plugins.value,
        userAgent: userAgentValue,
        touchSupport: components.touchSupport.value,
      },
      isOldBrowser: isOldBrowser(),
      browserInfo: browser,
      navigatorInfo: {
        cookieEnabled: navigator.cookieEnabled,
        javaEnabled: (navigator as any).javaEnabled(),
        language: navigator.language,
        languages: navigator.languages,
        onLine: navigator.onLine,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        doNotTrack: navigator.doNotTrack,
        maxTouchPoints: navigator.maxTouchPoints,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
      },
      screenInfo: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
      },
      performanceInfo: {
        memory: (performance as any).memory,
        timing: (performance as any).timing,
      },
      ipLocation: {
        ip: ipData.ip,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country_name,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        timezone: ipData.timezone,
        network: ipData.network,
        country_code: ipData.country_code,
        country_capital: ipData.country_capital,
        postal: ipData.postal,
        utc_offset: ipData.utc_offset,
        country_calling_code: ipData.country_calling_code,
        currency: ipData.currency,
        languages: ipData.languages,
        country_area: ipData.country_area,
        country_population: ipData.country_population,
        asn: ipData.asn,
        org: ipData.org,
      },
    };

    console.log(detailedInfo);
    return true;
  } catch (e) {
    console.error('Error in DeviceTest:', e);
    return false;
  }
};
