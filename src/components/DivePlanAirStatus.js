import { Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";

function DivePlanAirStatus({ gasStatus }) {
  const { available, reserve, used, totalDiveTime } = gasStatus;
  const remaining = Math.max(available - used, 0);
  const extra = Math.max(used - available, 0)
  const usedReserve = Math.max(reserve - extra, 0);

  let color = 'blue.500';
  if (usedReserve === 0) {
    color = 'red.500';
  } else if (used > available) {
    color = 'orange.500';
  }

  return (
    <StatGroup>
      <Stat textColor={color}>
        <StatLabel>{'Gas Used'}</StatLabel>
        <StatNumber>{used.toFixed(2)} l</StatNumber>
      </Stat>

      <Stat textColor={color}>
        <StatLabel>{'Gas Remaining'}</StatLabel>
        <StatNumber>{remaining.toFixed(2)} l</StatNumber>
      </Stat>

      <Stat textColor={color}>
        <StatLabel>{'Gas Reserved'}</StatLabel>
        <StatNumber>{usedReserve.toFixed(2)} l</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>{'Total Dive Time'}</StatLabel>
        <StatNumber>{(totalDiveTime || 0).toFixed(0)} min</StatNumber>
      </Stat>
    </StatGroup>
  );
}

export default DivePlanAirStatus;
