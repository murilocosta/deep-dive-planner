export const initialState = {
  planTank: {
    cylinderCapacity: 10,
    fillPresure: 200,
    reservePresure: 50,
    usableGas: null,
    reserveGas: null,
  },
  planAirConsumption: {
    pressureGaugeStart: 0,
    pressureGaugeEnd: 0,
    totalDiveTime: 0,
    averageDepth: 0,
    sac: null,
  },
  planDive: {
    safetyStopDuration: 3,
    rmv: null,
    trips: [],
  },
};

export function rootReducer(rootState, action) {
  switch (action.type) {
    case 'planTank/setTank':
      return {
        ...rootState,
        planTank: {
          ...action.payload,
        },
      };

    case 'planAirConsumption/setSAC':
      return {
        ...rootState,
        planAirConsumption: {
          ...action.payload,
        },
      };

    case 'planDive/updateSafetyStop':
      return {
        ...rootState,
        planDive: {
          ...rootState.planDive,
          safetyStopDuration: action.payload.safetyStopDuration,
          trips: rootState.planDive.trips.slice(0, -1).concat(action.payload.safetyStop),
        },
      };

    case 'planDive/addTrip':
      const { safetyStop, safetyStopDuration, rmv, trip } = action.payload;
      return {
        ...rootState,
        planDive: {
          safetyStopDuration,
          rmv,
          trips: rootState.planDive.trips.slice(0, -1).concat(trip).concat(safetyStop),
        },
      };

    default:
      return rootState;
  }
}