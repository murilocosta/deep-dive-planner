import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  VStack
} from "@chakra-ui/react";
import React, { useContext, useMemo, useState } from "react";

import { calculateGasConsumptionBar, calculateGasConsumptionLiter } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";

function DivePlanSafetyStop({ targetDepth }) {
  const { planTank, planAirConsumption, planDive } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  const [safetyStopDuration, setSafetyStopDuration] = useState(planDive.safetyStopDuration);

  const safetyStopConsumption = useMemo(
    () => calculateGasConsumptionBar(planAirConsumption.sac, targetDepth, safetyStopDuration, planTank.cylinderCapacity),
    [
      targetDepth,
      safetyStopDuration,
      planTank,
      planAirConsumption,
    ],
  );

  const safetyStopGasUsed = useMemo(
    () => calculateGasConsumptionLiter(planAirConsumption.sac, targetDepth, safetyStopDuration),
    [
      targetDepth,
      safetyStopDuration,
      planAirConsumption,
    ],
  );

  const handleUpdateSafetyStop = (event) => {
    event.preventDefault();

    dispatch({
      type: 'planDive/updateSafetyStop',
      payload: {
        safetyStopDuration,
        safetyStop: {
          type: 'safety',
          depth: targetDepth,
          duration: safetyStopDuration,
          gasUsed: safetyStopGasUsed,
        },
      },
    });
  }

  return (
    <form onSubmit={handleUpdateSafetyStop}>
      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>Safety Stop Plan (at 5m)</Heading>

        <FormControl>
          <FormLabel>Safety Stop Duration</FormLabel>
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

        <StatGroup>
          <Stat>
            <StatLabel>{'Ascent Consumption Rate'}</StatLabel>
            <StatNumber>{safetyStopConsumption.toFixed(2)} bar</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>{'Ascent Gas Needed'}</StatLabel>
            <StatNumber>{safetyStopGasUsed.toFixed(0)} l</StatNumber>
          </Stat>
        </StatGroup>

        <ButtonGroup variant={"outline"} alignSelf={"flex-end"}>
          <Button colorScheme='green' type='submit'>Update Safety Stop</Button>
        </ButtonGroup>
      </VStack>
    </form>
  );
}

export default DivePlanSafetyStop;
