export function getUrlArgs(string) {
  const params = new URLSearchParams(window.location.search);
  const context = params.get(string);
  return context === "undefined" ? "" : context;
}
