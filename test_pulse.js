const cmToUs = (cm) => Math.round(parseFloat(cm) * 58.2);
let duration = cmToUs(24.5);
console.log("Duration:", duration);
console.log("Distance:", duration / 58.2);

const duration2 = cmToUs(3.0);
console.log("Duration 3.0:", duration2);
console.log("Distance 3.0:", duration2 / 58.2);

// What float gives exactly 24.500000000000004?
console.log("Float exact:", 1425.9 / 58.2);
