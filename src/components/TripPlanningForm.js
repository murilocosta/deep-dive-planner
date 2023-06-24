import React, { useMemo, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack
} from "@chakra-ui/react";

import { calculateAtmosferePressure } from "../services/calculateAtmosferePressure";


function TripPlanningForm({ diveDetail, onAddTrip }) {
  // RMV calculation
  const [targetDepth, setTargetDepth] = useState(0);

  // Safety stop calculation
  const [safetyStopTime, setSafetyStopTime] = useState(3);

  // Ascent time calculation
  const [ascentRate, setAscentRate] = useState(9);

  const rmv = useMemo(() => {
    return diveDetail.sac * calculateAtmosferePressure(targetDepth);
  }, [
    diveDetail,
    targetDepth,
  ]);

  const gasConsumptionRate = useMemo(() => {
    return rmv / diveDetail.cylinderCapacity;
  }, [
    rmv,
    diveDetail,
  ]);

  const gasDuration = useMemo(() => {
    return diveDetail.usableGas / rmv;
  }, [
    diveDetail,
    rmv,
  ]);

  const safetyStopConsumption = useMemo(() => {
    const safetyStopRMV = diveDetail.sac * calculateAtmosferePressure(5);
    return safetyStopRMV * safetyStopTime / diveDetail.cylinderCapacity;
  }, [
    diveDetail,
    safetyStopTime,
  ]);

  const ascentTime = useMemo(() => {
    return targetDepth / ascentRate;
  }, [
    targetDepth,
    ascentRate,
  ]);

  const ascentGasConsumption = useMemo(() => {
    return rmv * ascentTime / diveDetail.cylinderCapacity;
  }, [
    rmv,
    ascentTime,
    diveDetail,
  ]);

  const ascentTotalGasConsumption = useMemo(() => {
    return ascentGasConsumption + safetyStopConsumption;
  }, [
    ascentGasConsumption,
    safetyStopConsumption,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault()
    onAddTrip({})
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>RMV (Respiratory Minute Volume)</Heading>

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
            <FormLabel>Consumption</FormLabel>
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

        <Heading as='h2' size='md'>Safety Stop</Heading>

        <HStack>
        <FormControl>
            <FormLabel>Safety Stop (at 5m)</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='safetyStopTime'
                value={safetyStopTime}
                onChange={(e) => setSafetyStopTime(e.target.value)}
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

        <Heading as='h2' size='md'>Ascent Rate</Heading>

        <HStack>
          <FormControl>
            <FormLabel>Ascent Rate</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='ascentRate'
                value={ascentRate}
                onChange={(e) => setAscentRate(e.target.value)}
              />
              <InputRightAddon children='m / min' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Ascent Time</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='ascentTime'
                value={ascentTime}
              />
              <InputRightAddon children='min' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Ascent Gas Consumption</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='ascentGasConsumption'
                value={ascentGasConsumption}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>
        </HStack>        

        <FormControl>
            <FormLabel>Ascent Total Gas Consumption</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='ascentTotalGasConsumption'
                value={ascentTotalGasConsumption}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>

        <HStack>
          <Button>Back</Button>
          <Button colorScheme='purple' type="submit">Add Trip</Button>
        </HStack>
      </VStack>
    </form>
  );
}

export default TripPlanningForm;