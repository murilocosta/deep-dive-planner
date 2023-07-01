export const initialState = {
  navigation: {
    activePage: 0,
  },
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
    trips: [],
    ascentRate: 9,
    ascentTrip: null,
    safetyStopDuration: 3,
    safetyStopTrip: null,
  },
};

export function rootReducer(rootState, action) {
  switch (action.type) {
    case 'navigation/setPage':
      return {
        ...rootState,
        navigation: {
          activePage: action.payload,
        },
      };
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

    case 'planDive/addTrip':
      return {
        ...rootState,
        planDive: {
          ...rootState.planDive,
          trips: [...rootState.planDive.trips, action.payload],
        },
      };

    case 'planDive/removeTrip':
      return {
        ...rootState,
        planDive: {
          ...rootState.planDive,
          trips: rootState.planDive.trips.filter((_, index) => index !== action.payload),
        },
      };

    case 'planDive/updateAscent':
      return {
        ...rootState,
        planDive: {
          ...rootState.planDive,
          ascentRate: action.payload.ascentRate,
          ascentTrip: action.payload.ascentTrip,
        },
      };

    case 'planDive/updateSafetyStop':
      return {
        ...rootState,
        planDive: {
          ...rootState.planDive,
          safetyStopDuration: action.payload.safetyStopDuration,
          safetyStopTrip: action.payload.safetyStop,
        },
      };

    default:
      return rootState;
  }
}