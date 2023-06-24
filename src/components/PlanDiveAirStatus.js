import { Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";

function PlanDiveAirStatus({ gasStatus }) {
  const { available = 0, used = 0 } = gasStatus;
  const remaining = available - used;

  return (
    <StatGroup>
      <Stat>
        <StatLabel>{'Gas Available'}</StatLabel>
        <StatNumber>{(available || 0)}</StatNumber>
      </Stat>

      <Stat textColor={'orange.500'}>
        <StatLabel>{'Gas Used'}</StatLabel>
        <StatNumber>{used}</StatNumber>
      </Stat>

      <Stat textColor={'green.500'}>
        <StatLabel>{'Gas Remaining'}</StatLabel>
        <StatNumber>{remaining}</StatNumber>
      </Stat>
    </StatGroup>
  );
}

export default PlanDiveAirStatus;