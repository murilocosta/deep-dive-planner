import { Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";

import { calculateRMV } from "../services/calculation";
import { RootStateContext } from "../state/RootStateContext";

function DivePlanRMV({ targetDepth, gasConsumed }) {
  const { planTank, planAirConsumption } = useContext(RootStateContext);

  const rmv = useMemo(
    () => calculateRMV(planAirConsumption.sac || 0, targetDepth),
    [
      targetDepth,
      planAirConsumption,
    ]
  );

  const gasConsumptionRate = useMemo(
    () => rmv / planTank.cylinderCapacity,
    [
      rmv,
      planTank,
    ]
  );

  const gasDuration = useMemo(
    () => (planTank.usableGas - gasConsumed) / (rmv || 1),
    [
      rmv,
      gasConsumed,
      planTank,
    ]
  );

  return (
    <StatGroup>
      <Stat>
        <StatLabel>{'RMV (Respiratory Minute Volume)'}</StatLabel>
        <StatNumber>{rmv.toFixed(2)} l/min</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>{'Consumption Rate'}</StatLabel>
        <StatNumber>{gasConsumptionRate.toFixed(2)} bar/min</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>{'Time Available'}</StatLabel>
        <StatNumber>{gasDuration.toFixed(0)} min</StatNumber>
      </Stat>
    </StatGroup>
  );
}

export default DivePlanRMV;
