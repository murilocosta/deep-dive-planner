import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack
} from "@chakra-ui/react";
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { calculateGasConsumptionBar, calculateGasConsumptionLiter, calculateRMV } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";
import PlanDiveAirStatus from "./PlanDiveAirStatus";
import PlanDiveTripDisplay from "./PlanDiveTripDisplay";

function PlanDiveForm() {
  const { planTank, planAirConsumption, planDive } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  const [safetyStopDuration, setSafetyStopDuration] = useState(planDive.safetyStopDuration);
  const [targetDepth, setTargetDepth] = useState(0);
  const [targetDepthDuration, setTargetDepthDuration] = useState(0);

  const safetyStopConsumption = useMemo(() => {
    return calculateGasConsumptionBar(planAirConsumption.sac, 5, safetyStopDuration, planTank.cylinderCapacity);
  }, [
    safetyStopDuration,
    planTank,
    planAirConsumption,
  ]);

  const gasConsumed = useMemo(() => {
    if (planDive.trips.length === 0) {
      return 0;
    }

    const calculateTotal = (total, current) => total + Number(current.gasUsed);
    return planDive.trips.reduce(calculateTotal, 0);
  }, [
    planDive,
  ]);

  const rmv = useMemo(() => {
    if (planAirConsumption.sac > 0) {
      return calculateRMV(planAirConsumption.sac, targetDepth);
    }

    return 0;
  }, [
    targetDepth,
    planAirConsumption,
  ]);

  const gasConsumptionRate = useMemo(() => {
    if (rmv === 0) {
      return 0;
    }

    return rmv / planTank.cylinderCapacity;
  }, [
    rmv,
    planTank,
  ]);

  const gasDuration = useMemo(() => {
    if (rmv === 0) {
      return 0;
    }

    return (planTank.usableGas - gasConsumed) / rmv;
  }, [
    rmv,
    gasConsumed,
    planTank,
  ]);

  const createSafetyStop = () => ({
    depth: 5,
    duration: safetyStopDuration,
    gasUsed: calculateGasConsumptionLiter(planAirConsumption.sac, 5, safetyStopDuration),
  });

  const handleUpdateSafetyStop = (event) => {
    event.preventDefault();
    dispatch({
      type: 'planDive/updateSafetyStop',
      payload: {
        safetyStopDuration,
        safetyStop: createSafetyStop(),
      }
    });
  }

  const handleAddTrip = (event) => {
    event.preventDefault();
    dispatch({
      type: 'planDive/addTrip',
      payload: {
        safetyStop: createSafetyStop(),
        safetyStopDuration,
        rmv,
        trip: {
          depth: targetDepth,
          duration: targetDepthDuration,
          gasUsed: calculateGasConsumptionLiter(planAirConsumption.sac, targetDepth, targetDepthDuration),
        },
      }
    });
  };

  return (
    <>
      <VStack align={'left'} spacing={10}>
        <PlanDiveAirStatus gasStatus={{ available: planTank.usableGas, used: gasConsumed }} />

        <Heading as='h2' size='md'>Safety Stop</Heading>

        <HStack>
          <FormControl>
            <FormLabel>Safety Stop Duration (at 5m)</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='safetyStopDuration'
                value={safetyStopDuration}
                onChange={(e) => setSafetyStopDuration(e.target.value)}
              />
              <InputRightAddon children='min' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Safety Stop Gas Consumption</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='safetyStopConsumption'
                value={safetyStopConsumption}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <ButtonGroup variant={"outline"}>
            <Button colorScheme='green' onClick={handleUpdateSafetyStop}>Update Safety Stop</Button>
          </ButtonGroup>
        </HStack>

        <Heading as='h2' size='md'>Dive Trip</Heading>

        <HStack>
          <FormControl>
            <FormLabel>Target Depth</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='targetDepth'
                value={targetDepth}
                onChange={(e) => setTargetDepth(e.target.value)}
              />
              <InputRightAddon children='meters' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Target Depth Duration</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='targetDepthDuration'
                value={targetDepthDuration}
                onChange={(e) => setTargetDepthDuration(e.target.value)}
              />
              <InputRightAddon children='min' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <FormControl>
            <FormLabel>RMV</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='rmv'
                value={rmv}
              />
              <InputRightAddon children='l / min' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>&nbsp;</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='gasConsumptionRate'
                value={gasConsumptionRate}
              />
              <InputRightAddon children='bar / min' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Gas Duration</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='gasDuration'
                value={gasDuration}
              />
              <InputRightAddon children='min' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <ButtonGroup variant={"outline"}>
            <Button colorScheme='green' onClick={handleAddTrip}>Add Trip</Button>
          </ButtonGroup>
        </HStack>

        <PlanDiveTripDisplay trips={planDive.trips} />

        <HStack>
          <ButtonGroup variant={"outline"}>
            <Button as={Link} to='/'>Back</Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </>
  );
}

export default PlanDiveForm;