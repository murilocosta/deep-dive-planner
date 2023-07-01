import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildWholeDive } from "../services/buildWholeDive";
import { calculateGasConsumptionLiter } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from "../state/RootStateContext";
import DivePlanAirStatus from "./DivePlanAirStatus";
import DivePlanAscentRate from "./DivePlanAscentRate";
import DivePlanRMV from "./DivePlanRMV";
import DivePlanSafetyStop from "./DivePlanSafetyStop";
import DivePlanTripManager from "./DivePlanTripManager";
import RootStepper from "./RootStepper";

function PlanDiveForm() {
  const navigateTo = useNavigate();

  const { planTank, planAirConsumption, planDive } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  useEffect(
    () => {
      if (planTank.usableGas == null) {
        navigateTo("/tank-setup");
      }
    },
    [planTank]
  );

  const [targetDepth, setTargetDepth] = useState(0);
  const [targetDepthDuration, setTargetDepthDuration] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const wholeDive = useMemo(
    () => buildWholeDive(planDive),
    [
      planDive,
    ]
  );

  const gasConsumed = useMemo(() => {
    const calculateTotal = (total, current) => total + Number(current.gasUsed);
    return wholeDive.reduce(calculateTotal, 0);
  }, [
    wholeDive,
  ]);

  const handleNavigation = (event) => {
    event.preventDefault();

    dispatch({
      type: 'navigation/setPage',
      payload: 1,
    });

    navigateTo("/air-consumption");
  }

  const handleAddTrip = (event) => {
    event.preventDefault();

    dispatch({
      type: 'planDive/addTrip',
      payload: {
        type: 'normal',
        depth: targetDepth,
        duration: targetDepthDuration,
        gasUsed: calculateGasConsumptionLiter(planAirConsumption.sac, targetDepth, targetDepthDuration),
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    navigateTo("/show-dive-plan");
  }

  return (
    <>
      <RootStepper />

      <VStack align={'left'} spacing={10}>
        <DivePlanAirStatus gasStatus={{ available: planTank.usableGas, used: gasConsumed }} />

        <Heading as='h2' size='md'>Dive Trip</Heading>

        <FormControl>
          <FormLabel>Target Depth</FormLabel>
          <InputGroup>
            <Input
              type='number'
              name='targetDepth'
              value={targetDepth}
              onChange={(e) => setTargetDepth(e.target.value)}
            />
            <InputRightAddon children='m' />
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

        <DivePlanRMV targetDepth={targetDepth} gasConsumed={gasConsumed} />

        <ButtonGroup variant={"outline"} alignSelf={"flex-end"}>
          <Button colorScheme='green' onClick={onOpen}>Manage Trips</Button>
          <Button colorScheme='green' onClick={handleAddTrip}>Add Trip</Button>
        </ButtonGroup>

        <DivePlanTripManager isOpen={isOpen} onClose={onClose} trips={planDive.trips} />

        <DivePlanAscentRate targetDepth={targetDepth} />

        <DivePlanSafetyStop targetDepth={5} />

        <ButtonGroup variant={"outline"}>
          <Button onClick={handleNavigation}>Back</Button>
          <Button colorScheme='purple' onClick={handleSubmit}>Confirm Dive Plan</Button>
        </ButtonGroup>
      </VStack>
    </>
  );
}

export default PlanDiveForm;