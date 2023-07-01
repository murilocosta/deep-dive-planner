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
import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { calculateSAC } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";
import RootStepper from "./RootStepper";

function PlanAirConsumptionForm() {
  const navigateTo = useNavigate();

  const { planTank, planAirConsumption } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  useEffect(
    () => {
      if (planTank.usableGas == null) {
        navigateTo("/tank-setup");
      }
    },
    [planTank, navigateTo]
  );

  const [pressureGaugeStart, setPressureGaugeStart] = useState(planAirConsumption.pressureGaugeStart);
  const [pressureGaugeEnd, setPressureGaugeEnd] = useState(planAirConsumption.pressureGaugeEnd);
  const [averageDepth, setAverageDepth] = useState(planAirConsumption.averageDepth);
  const [totalDiveTime, setTotalDiveTime] = useState(planAirConsumption.totalDiveTime);

  const sac = useMemo(() => {
    if (totalDiveTime > 0) {
      return calculateSAC(
        pressureGaugeStart,
        pressureGaugeEnd,
        planTank.cylinderCapacity,
        averageDepth,
        totalDiveTime
      );
    }

    return 0;
  }, [
    pressureGaugeStart,
    pressureGaugeEnd,
    averageDepth,
    totalDiveTime,
    planTank,
  ]);

  const handleNavigation = (event) => {
    event.preventDefault();

    dispatch({
      type: 'navigation/setPage',
      payload: 0,
    });

    navigateTo("/tank-setup");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: 'planAirConsumption/setSAC',
      payload: {
        pressureGaugeStart,
        pressureGaugeEnd,
        totalDiveTime,
        averageDepth,
        sac
      },
    });

    dispatch({
      type: 'navigation/setPage',
      payload: 2,
    });

    navigateTo("/dive-plan");
  }

  return (
    <form onSubmit={handleSubmit}>
      <RootStepper />

      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>SAC (Surface Air Consumption)</Heading>

        <FormControl>
          <FormLabel>Start Pressure Gauge</FormLabel>
          <InputGroup>
            <Input
              type='number'
              min={0}
              name='pressureGaugeStart'
              value={pressureGaugeStart}
              onChange={(e) => setPressureGaugeStart(e.target.value)}
            />
            <InputRightAddon children='bar' />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>End Pressure Gauge</FormLabel>
          <InputGroup>
            <Input
              type='number'
              min={0}
              name='pressureGaugeEnd'
              value={pressureGaugeEnd}
              onChange={(e) => setPressureGaugeEnd(e.target.value)}
            />
            <InputRightAddon children='bar' />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Average Dive Depth</FormLabel>
          <InputGroup>
            <Input
              type='decimal'
              min={0}
              step={1}
              name='averageDepth'
              value={averageDepth}
              onChange={(e) => setAverageDepth(e.target.value)}
            />
            <InputRightAddon children='m' />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Total Dive Time</FormLabel>
          <InputGroup>
            <Input
              type='decimal'
              min={0}
              step={1}
              name='totalDiveTime'
              value={totalDiveTime}
              onChange={(e) => setTotalDiveTime(e.target.value)}
            />
            <InputRightAddon children='min' />
          </InputGroup>
        </FormControl>

        <StatGroup>
          <Stat>
            <StatLabel>{'Estimated SAC'}</StatLabel>
            <StatNumber>{(sac || 0).toFixed(2)} l / min</StatNumber>
          </Stat>
        </StatGroup>

        <ButtonGroup variant={"outline"}>
          <Button leftIcon={<ArrowBackIcon />} onClick={handleNavigation}>Back</Button>
          <Button leftIcon={<CheckIcon />} colorScheme='purple' type="submit">Confirm Air Consumption</Button>
        </ButtonGroup>
      </VStack>
    </form>
  );
}

export default PlanAirConsumptionForm;