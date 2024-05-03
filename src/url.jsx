export function getUrlArgs(string) {
    const params = new URLSearchParams(window.location.search);
    const context = params.get(string);
    return context === "undefined" ? "" : context;
}

export function changeUrlArgs(url, arg, arg_val) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(arg, arg_val);
    return urlObj.toString();
}
