export function calculateUsableGas(pressureGaugeStart, pressureGaugeEnd, cylinderCapacity) {
    return (pressureGaugeStart - pressureGaugeEnd) * cylinderCapacity
}

export function calculateAtmosferePressure(depth) {
    return (depth / 10) + 1;
}

export function calculateSAC(pressureGaugeStart, pressureGaugeEnd, cylinderCapacity, averageDepth, totalDiveTime) {
    const gasUsed = calculateUsableGas(pressureGaugeStart, pressureGaugeEnd, cylinderCapacity);
    const gasConsumption = gasUsed / totalDiveTime;
    return gasConsumption / calculateAtmosferePressure(averageDepth);
}

export function calculateRMV(sac, depth) {
    return sac * calculateAtmosferePressure(depth)
}

export function calculateGasConsumptionLiter(sac, depth, duration) {
    return calculateRMV(sac, depth) * duration;
}

export function calculateGasConsumptionBar(sac, depth, duration, cylinderCapacity) {
    return calculateGasConsumptionLiter(sac, depth, duration) / cylinderCapacity;
}
