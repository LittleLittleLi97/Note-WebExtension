export function getUrlIcon(): string {
    const icon1 = document.querySelector("link[rel='apple-touch-icon']");
    const icon2 = document.querySelector("link[rel='shortcut icon']");
    const icon3 = document.querySelector("link[rel='icon']");
    const iconValid = icon1 || icon2 || icon3;
    return iconValid ? (iconValid as HTMLLinkElement).href : '/img/Icon-128.png';
}

export function removeUrlQuery(url: string): string {
    const obj = new URL(url);
    return obj.origin + obj.pathname;
}