export function formatDateTime(date) {
    if (!date) return "";

    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).replace(",", "");
}
