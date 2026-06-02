export function isValidConnection(pinA, pinB) {
    // prevent same pin connection
    if (pinA === pinB) {
        return false;
    }

    // prevent power short
    if (
        (pinA === "5V" && pinB === "GND") ||
        (pinA === "GND" && pinB === "5V")
    ) {
        return false;
    }

    return true;
}