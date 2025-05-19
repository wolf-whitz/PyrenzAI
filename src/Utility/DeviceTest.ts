import Bowser from "bowser";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface ComponentWithValue {
    value: any;
}

export const DeviceTest = async () => {
    try {
        const isOldBrowser = (): boolean => {
            switch (true) {
                case typeof Promise === 'undefined':
                case typeof fetch !== 'function':
                case typeof Object.assign !== 'function':
                case typeof Array.prototype.includes !== 'function':
                    console.log('Old browser detected: missing modern JS features');
                    return true;
                default:
                    return false;
            }
        };

        if (isOldBrowser()) {
            return false;
        }

        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const { visitorId, components } = await fp.get();

        localStorage.setItem('visitorId', visitorId);

        const screenResolution = components.screenResolution as ComponentWithValue;
        const fonts = components.fonts as ComponentWithValue;
        const timezone = components.timezone as ComponentWithValue;
        const languages = components.languages as ComponentWithValue;
        const plugins = components.plugins as ComponentWithValue;
        const userAgent = 'userAgent' in components ? components.userAgent as ComponentWithValue : null;
        const touchSupport = components.touchSupport as ComponentWithValue;

        const logAll = () => {
            const reasons: string[] = [];
            let capable: boolean = true;

            switch (true) {
                case (navigator as any).deviceMemory < 8:
                    capable = false;
                    reasons.push(`Not enough RAM (${(navigator as any).deviceMemory}GB < 8GB)`);
                    break;
            }

            if (capable) {
                reasons.push('Device looks capable of running LLM locally');
            }

            const browser = Bowser.getParser(userAgent?.value || navigator.userAgent);
            const browserInfo = browser.getResult();

            const detailedInfo = {
                visitorId: visitorId,
                screenResolution: screenResolution.value,
                fonts: fonts.value,
                timezone: timezone.value,
                languages: languages.value,
                plugins: plugins.value,
                userAgent: userAgent?.value,
                touchSupport: touchSupport.value,
                isOldBrowser: isOldBrowser(),
                llmCapable: capable,
                llmDetails: reasons,
                browserInfo: browserInfo,
                navigatorInfo: {
                    cookieEnabled: navigator.cookieEnabled,
                    javaEnabled: navigator.javaEnabled(),
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
                locationInfo: {
                    href: location.href,
                    protocol: location.protocol,
                    hostname: location.hostname,
                    port: location.port,
                    pathname: location.pathname,
                    search: location.search,
                    hash: location.hash,
                },
                performanceInfo: {
                    memory: (performance as any).memory,
                    timing: performance.timing,
                },
            };

            console.log(detailedInfo);
        };

        logAll();

        return true;
    } catch (e) {
        console.log('Error in DeviceTest:', e);
        return false;
    }
};
