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
import { TimeIcon } from "@chakra-ui/icons";
import React, { useContext, useMemo, useState } from "react";

import { calculateRMV } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";

function DivePlanAscentRate({ targetDepth }) {
  const { planTank, planAirConsumption, planDive } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  const [ascentRate, setAscentRate] = useState(planDive.ascentRate);

  const depth = useMemo(() => Math.max(0, targetDepth - 5), [targetDepth])

  const rmv = useMemo(
    () => calculateRMV(planAirConsumption.sac, depth),
    [
      planAirConsumption,
      depth,
    ]
  );

  const ascentDuration = useMemo(
    () => depth / ascentRate,
    [
      depth,
      ascentRate,
    ]
  );

  const ascentGasConsumption = useMemo(() => {
    return rmv * ascentDuration / planTank.cylinderCapacity;
  }, [
    rmv,
    ascentDuration,
    planTank,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch({
      type: 'planDive/updateAscent',
      payload: {
        ascentRate: ascentRate,
        ascentTrip: {
          type: 'ascent',
          depth: targetDepth,
          duration: ascentDuration,
          gasUsed: ascentDuration * ascentGasConsumption,
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>Ascent Plan (to 5m)</Heading>

        <FormControl>
          <FormLabel>Ascent Rate</FormLabel>
          <InputGroup>
            <Input
              type='number'
              min={0}
              name='ascentRate'
              value={ascentRate}
              onChange={(e) => setAscentRate(e.target.value)}
            />
            <InputRightAddon children='m / min' />
          </InputGroup>
        </FormControl>

        <StatGroup>
          <Stat>
            <StatLabel>{'Ascent Duration'}</StatLabel>
            <StatNumber>{ascentDuration.toFixed(2)} min</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>{'Ascent Consumption Rate'}</StatLabel>
            <StatNumber>{ascentGasConsumption.toFixed(2)} bar</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>{'Ascent Gas Needed'}</StatLabel>
            <StatNumber>{(ascentDuration * ascentGasConsumption).toFixed(0)} l</StatNumber>
          </Stat>
        </StatGroup>

        <ButtonGroup variant={"outline"} alignSelf={"flex-end"}>
          <Button leftIcon={<TimeIcon />} colorScheme='green' type="submit">Update Ascent</Button>
        </ButtonGroup>
      </VStack>
    </form>
  );
}

export default DivePlanAscentRate;
