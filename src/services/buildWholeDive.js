export function buildWholeDive(planDiveState) {
  const result = [];

  if (planDiveState.trips.length > 0) {
    result.push(...planDiveState.trips);
  }

  if (planDiveState.ascentTrip != null) {
    result.push(planDiveState.ascentTrip);
  }

  if (planDiveState.safetyStopTrip != null) {
    result.push(planDiveState.safetyStopTrip);
  }

  return result;
}
