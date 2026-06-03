/**
 * Web Serial Flasher for Arduino boards.
 * Uses the Web Serial API + STK500v1 protocol to flash compiled .hex
 * files directly from the browser to a physical Arduino Uno/Nano.
 */

let serialPort = null;

/**
 * Parse Intel HEX string into a Uint8Array binary buffer.
 */
function parseHex(hexString) {
    const lines = hexString.split('\n').filter(l => l.startsWith(':'));
    // Calculate total size
    let maxAddr = 0;
    for (const line of lines) {
        const byteCount = parseInt(line.substr(1, 2), 16);
        const address = parseInt(line.substr(3, 4), 16);
        const recordType = parseInt(line.substr(7, 2), 16);
        if (recordType === 0x00) {
            maxAddr = Math.max(maxAddr, address + byteCount);
        }
    }

    const buffer = new Uint8Array(maxAddr).fill(0xFF);
    for (const line of lines) {
        const byteCount = parseInt(line.substr(1, 2), 16);
        const address = parseInt(line.substr(3, 4), 16);
        const recordType = parseInt(line.substr(7, 2), 16);
        if (recordType === 0x00) {
            for (let i = 0; i < byteCount; i++) {
                buffer[address + i] = parseInt(line.substr(9 + i * 2, 2), 16);
            }
        }
    }
    return buffer;
}

/**
 * Request a serial port from the user and open it.
 */
export async function connectToBoard(baudRate = 115200) {
    if (!('serial' in navigator)) {
        throw new Error('Web Serial API is not supported in this browser. Please use Chrome or Edge.');
    }

    try {
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate });
        return serialPort;
    } catch (e) {
        serialPort = null;
        throw new Error(`Failed to connect: ${e.message}`);
    }
}

/**
 * Disconnect from the serial port.
 */
export async function disconnectFromBoard() {
    if (serialPort) {
        try {
            await serialPort.close();
        } catch (e) {
            // Port might already be closed
        }
        serialPort = null;
    }
}

/**
 * Get the currently connected port (or null).
 */
export function getPort() {
    return serialPort;
}

/**
 * Flash a compiled hex string to the connected Arduino board.
 * Uses STK500v1 protocol (Arduino Uno bootloader).
 */
export async function flashToBoard(hexString, onProgress) {
    if (!serialPort) {
        throw new Error('No board connected. Click "Connect" first.');
    }

    onProgress?.('Parsing hex file...');
    const hexBuffer = parseHex(hexString);

    onProgress?.('Resetting board (toggling DTR)...');

    // Toggle DTR to reset the Arduino into bootloader mode
    await serialPort.setSignals({ dataTerminalReady: false });
    await new Promise(r => setTimeout(r, 250));
    await serialPort.setSignals({ dataTerminalReady: true });

    // Wait for bootloader to start
    await new Promise(r => setTimeout(r, 1500));

    // Close and reopen at 115200 baud for bootloader communication
    const reader = serialPort.readable.getReader();
    const writer = serialPort.writable.getWriter();

    try {
        onProgress?.('Entering bootloader...');

        // STK500v1 Sync
        const STK_GET_SYNC = 0x30;
        const STK_CRC_EOP = 0x20;
        const STK_OK = 0x10;
        const STK_INSYNC = 0x14;
        const STK_LOAD_ADDRESS = 0x55;
        const STK_PROG_PAGE = 0x64;
        const STK_LEAVE_PROGMODE = 0x51;

        // Helper to send a command and wait for STK_INSYNC + STK_OK
        async function sendCommand(data) {
            await writer.write(new Uint8Array(data));
            // Read response
            const response = await readBytes(reader, 2, 1000);
            if (response[0] !== STK_INSYNC || response[1] !== STK_OK) {
                throw new Error(`STK500 sync failed: got [${response.join(',')}]`);
            }
        }

        // Sync with bootloader (try multiple times)
        let synced = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                // Drain any pending data
                try {
                    const { value } = await Promise.race([
                        reader.read(),
                        new Promise((_, reject) => setTimeout(() => reject('timeout'), 100))
                    ]);
                } catch (e) { /* ignore */ }

                await writer.write(new Uint8Array([STK_GET_SYNC, STK_CRC_EOP]));
                const resp = await readBytes(reader, 2, 500);
                if (resp[0] === STK_INSYNC && resp[1] === STK_OK) {
                    synced = true;
                    break;
                }
            } catch (e) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        if (!synced) {
            throw new Error('Could not sync with Arduino bootloader. Make sure the board is connected and the correct port is selected.');
        }

        onProgress?.('Bootloader synced. Uploading...');

        // Flash in 128-byte pages (standard for ATmega328p bootloader)
        const PAGE_SIZE = 128;
        const totalPages = Math.ceil(hexBuffer.length / PAGE_SIZE);

        for (let page = 0; page < totalPages; page++) {
            const address = page * PAGE_SIZE / 2; // Word address (not byte address)
            const addrLow = address & 0xFF;
            const addrHigh = (address >> 8) & 0xFF;

            // Load address
            await writer.write(new Uint8Array([STK_LOAD_ADDRESS, addrLow, addrHigh, STK_CRC_EOP]));
            const addrResp = await readBytes(reader, 2, 1000);
            if (addrResp[0] !== STK_INSYNC || addrResp[1] !== STK_OK) {
                throw new Error(`Failed to set address for page ${page}`);
            }

            // Prepare page data
            const start = page * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE, hexBuffer.length);
            const pageData = hexBuffer.slice(start, end);
            const paddedPage = new Uint8Array(PAGE_SIZE).fill(0xFF);
            paddedPage.set(pageData);

            // Program page
            const progCmd = new Uint8Array([
                STK_PROG_PAGE,
                (PAGE_SIZE >> 8) & 0xFF,
                PAGE_SIZE & 0xFF,
                0x46, // 'F' for Flash memory
                ...paddedPage,
                STK_CRC_EOP
            ]);
            await writer.write(progCmd);
            const progResp = await readBytes(reader, 2, 5000);
            if (progResp[0] !== STK_INSYNC || progResp[1] !== STK_OK) {
                throw new Error(`Failed to program page ${page}`);
            }

            const percent = Math.round(((page + 1) / totalPages) * 100);
            onProgress?.(`Uploading: ${percent}%`);
        }

        // Leave programming mode
        await writer.write(new Uint8Array([STK_LEAVE_PROGMODE, STK_CRC_EOP]));
        const leaveResp = await readBytes(reader, 2, 1000);

        onProgress?.('Upload complete! Board is running your sketch.');

    } finally {
        reader.releaseLock();
        writer.releaseLock();
    }
}

/**
 * Read exactly `count` bytes from a serial reader with a timeout.
 */
async function readBytes(reader, count, timeoutMs) {
    const buffer = [];
    const deadline = Date.now() + timeoutMs;

    while (buffer.length < count) {
        if (Date.now() > deadline) {
            throw new Error(`Timeout waiting for ${count} bytes (got ${buffer.length})`);
        }

        const { value, done } = await Promise.race([
            reader.read(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Read timeout')), Math.max(50, deadline - Date.now()))
            )
        ]);

        if (done) break;
        if (value) {
            for (const byte of value) {
                buffer.push(byte);
                if (buffer.length >= count) break;
            }
        }
    }

    return new Uint8Array(buffer);
}
