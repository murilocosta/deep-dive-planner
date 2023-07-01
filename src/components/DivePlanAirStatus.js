import { Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";

function DivePlanAirStatus({ gasStatus }) {
  const { available, used = 0 } = gasStatus;
  const remaining = available - used;

  return (
    <StatGroup>
      <Stat>
        <StatLabel>{'Gas Available'}</StatLabel>
        <StatNumber>{(available || 0).toFixed(2)} l</StatNumber>
      </Stat>

      <Stat textColor={'orange.500'}>
        <StatLabel>{'Gas Used'}</StatLabel>
        <StatNumber>{used.toFixed(2)} l</StatNumber>
      </Stat>

      <Stat textColor={'green.500'}>
        <StatLabel>{'Gas Remaining'}</StatLabel>
        <StatNumber>{remaining.toFixed(2)} l</StatNumber>
      </Stat>
    </StatGroup>
  );
}

export default DivePlanAirStatus;
