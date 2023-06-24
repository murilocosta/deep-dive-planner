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
import { Link, useNavigate } from "react-router-dom";

import { calculateSAC } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";

function PlanAirConsumptionForm() {
  const navigateTo = useNavigate();

  const { planTank, planAirConsumption } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

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
    navigateTo("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>SAC (Surface Air Consumption)</Heading>

        <HStack>
          <FormControl>
            <FormLabel>Start Pressure Gauge</FormLabel>
            <InputGroup>
              <Input
                type='number'
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
                name='pressureGaugeEnd'
                value={pressureGaugeEnd}
                onChange={(e) => setPressureGaugeEnd(e.target.value)}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
        <FormControl>
            <FormLabel>Average Dive Depth</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='averageDepth'
                value={averageDepth}
                onChange={(e) => setAverageDepth(e.target.value)}
              />
              <InputRightAddon children='meters' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Total Dive Time</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='totalDiveTime'
                value={totalDiveTime}
                onChange={(e) => setTotalDiveTime(e.target.value)}
              />
              <InputRightAddon children='min' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <FormControl>
            <FormLabel>SAC</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='sac'
                value={sac}
              />
              <InputRightAddon children='l / min' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <ButtonGroup variant={"outline"}>
            <Button as={Link} to='/'>Back</Button>
            <Button colorScheme='purple' type="submit">Confirm</Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </form>
  );
}

export default PlanAirConsumptionForm;