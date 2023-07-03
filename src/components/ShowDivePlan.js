import {
  Button,
  ButtonGroup,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowUpIcon, RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";


import { buildWholeDive } from "../services/buildWholeDive";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";
import DivePlanTripChart from "./DivePlanTripChart";
import RootStepper from "./RootStepper";

function convertMinutesToHourFormat(timeInMinutes) {
  const hour = Math.floor(timeInMinutes / 60);
  const minute = Math.round(timeInMinutes % 60);

  return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
}

function printIconByType(tripType) {
  switch (tripType) {
    case 'safety':
      return <TimeIcon />;

    case 'ascent':
      return <ArrowUpIcon />
    
    default:
      return null;
  }
}

function ShowDivePlan() {
  const navigateTo = useNavigate();

  const { planTank, planDive } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  useEffect(
    () => {
      if (planTank.usableGas == null) {
        navigateTo('/tank-setup');
      }
    },
    [planTank, navigateTo]
  );

  const wholeDive = useMemo(() => buildWholeDive(planDive), [planDive]);

  function accumulateDive(total, current) {
    total.duration += Number(current.duration);
    total.gasUsed += Number(current.gasUsed);
    return total;
  }

  const totalDive = useMemo(() => wholeDive.reduce(accumulateDive, { duration: 0, gasUsed: 0 }), [wholeDive]);
  const lessSafety = (planTank.usableGas - totalDive.gasUsed) < 0
  const currentReserveGas = (planTank.usableGas + planTank.reserveGas) - totalDive.gasUsed;

  const handleNavigation = (event) => {
    event.preventDefault();

    dispatch({
      type: 'navigation/setPage',
      payload: 2,
    });

    navigateTo('/dive-plan');
  }

  const handleReset = (event) => {
    event.preventDefault();
    dispatch({ type: 'rootState/reset' })
    navigateTo('/tank-setup');
  }

  return (
    <VStack align={'left'} spacing={10}>
      <RootStepper />

      <StatGroup>
        <Stat textColor={lessSafety ? 'red.500' : 'blue.500'}>
          <StatLabel>{'Planned Gas Consumption'}</StatLabel>
          <StatNumber>{(totalDive.gasUsed / planTank.cylinderCapacity).toFixed(2)} bar</StatNumber>
        </Stat>

        <Stat textColor={lessSafety ? 'red.500' : 'blue.500'}>
          <StatLabel>{'Planned Reserve Gas'}</StatLabel>
          <StatNumber>{(currentReserveGas / planTank.cylinderCapacity).toFixed(2)} bar</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>{'Planned Dive Time'}</StatLabel>
          <StatNumber>{convertMinutesToHourFormat(totalDive.duration)}</StatNumber>
        </Stat>
      </StatGroup>

      <TableContainer>
        <Table variant='simple'>
          <TableCaption>{'Dive plan breakdown'}</TableCaption>

          <Thead>
            <Tr>
              <Th>{'Depth'}</Th>
              <Th>{'Duration'}</Th>
              <Th>{'Consumption'}</Th>
            </Tr>
          </Thead>

          <Tbody>
            {wholeDive.map((trip, index) => (
              <Tr key={index}>
                <Td>{trip.depth} m</Td>
                <Td>{convertMinutesToHourFormat(trip.duration)}</Td>
                <Td>{(trip.gasUsed / planTank.cylinderCapacity).toFixed(2)} bar</Td>
                <Td>{printIconByType(trip.type)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>


      <DivePlanTripChart trips={wholeDive} />

      <ButtonGroup variant={'outline'}>
        <Button leftIcon={<ArrowBackIcon />} onClick={handleNavigation}>Back</Button>
        <Button leftIcon={<RepeatIcon />} colorScheme='purple' onClick={handleReset}>Reset</Button>
      </ButtonGroup>
    </VStack>
  );
}

export default ShowDivePlan;
