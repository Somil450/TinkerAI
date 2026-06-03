/**
 * Serial Monitor - reads and writes text data from/to
 * a physical Arduino over Web Serial API.
 */

let reader = null;
let readableStreamClosed = null;
let keepReading = false;

/**
 * Start reading serial data from the given port.
 * Calls `onData(text)` for each chunk received.
 */
export async function startSerialMonitor(port, onData, baudRate = 9600) {
    if (!port || !port.readable) {
        throw new Error('Port is not open or readable.');
    }

    keepReading = true;

    // If port is already open at a different baud rate, close and reopen
    // (Note: the flasher opens at 115200, but Serial.begin() in sketches typically uses 9600)
    try {
        await port.close();
    } catch (e) { /* might already be closed */ }

    await port.open({ baudRate });

    const textDecoder = new TextDecoderStream();
    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    // Read loop
    (async () => {
        try {
            while (keepReading) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    onData(value);
                }
            }
        } catch (e) {
            if (keepReading) {
                onData(`\n[Serial Error: ${e.message}]\n`);
            }
        } finally {
            try { reader.releaseLock(); } catch (e) {}
        }
    })();
}

/**
 * Send a string to the Arduino over serial.
 */
export async function sendSerialData(port, text) {
    if (!port || !port.writable) {
        throw new Error('Port is not writable.');
    }

    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    try {
        await writer.write(encoder.encode(text));
    } finally {
        writer.releaseLock();
    }
}

/**
 * Stop reading from the serial port.
 */
export async function stopSerialMonitor() {
    keepReading = false;
    if (reader) {
        try {
            await reader.cancel();
        } catch (e) {}
        reader = null;
    }
    if (readableStreamClosed) {
        try {
            await readableStreamClosed.catch(() => {});
        } catch (e) {}
        readableStreamClosed = null;
    }
}
