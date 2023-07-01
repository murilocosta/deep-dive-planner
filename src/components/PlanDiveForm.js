import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, CheckIcon, SettingsIcon } from "@chakra-ui/icons";
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
        navigateTo('/tank-setup');
      }
    },
    [planTank, navigateTo]
  );

  const [targetDepth, setTargetDepth] = useState(0);
  const [targetDepthDuration, setTargetDepthDuration] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const wholeDive = useMemo(() => buildWholeDive(planDive), [planDive]);

  const gasConsumed = useMemo(() => {
    const calculateTotal = (total, current) => total + Number(current.gasUsed);
    return wholeDive.reduce(calculateTotal, 0);
  }, [
    wholeDive,
  ]);

  const totalDiveTime = useMemo(() => {
    const calculateTotal = (total, current) => total + Number(current.duration);
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

    navigateTo('/air-consumption');
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

    dispatch({
      type: 'navigation/setPage',
      payload: 3,
    });

    navigateTo('/show-dive-plan');
  }

  return (
    <>
      <RootStepper />

      <VStack align={'left'} spacing={10}>
        <DivePlanAirStatus
          gasStatus={{
            available: planTank.usableGas,
            reserve: planTank.reserveGas,
            used: gasConsumed,
            totalDiveTime: totalDiveTime
          }}
        />

        <Heading as='h2' size='md'>Dive Trip</Heading>

        <FormControl>
          <FormLabel>Target Depth</FormLabel>
          <InputGroup>
            <Input
              type='decimal'
              min={0}
              step={1}
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
              min={0}
              name='targetDepthDuration'
              value={targetDepthDuration}
              onChange={(e) => setTargetDepthDuration(e.target.value)}
            />
            <InputRightAddon children='min' />
          </InputGroup>
        </FormControl>

        <DivePlanRMV targetDepth={targetDepth} gasConsumed={gasConsumed} />

        <ButtonGroup variant={'outline'} alignSelf={'flex-end'}>
          <Button leftIcon={<SettingsIcon />} onClick={onOpen}>Manage Trips</Button>
          <Button leftIcon={<AddIcon />} colorScheme='green' onClick={handleAddTrip}>Add Trip</Button>
        </ButtonGroup>

        <DivePlanTripManager isOpen={isOpen} onClose={onClose} trips={planDive.trips} />

        <Divider />

        <DivePlanAscentRate targetDepth={targetDepth} />

        <Divider />

        <DivePlanSafetyStop targetDepth={5} />

        <Divider />

        <ButtonGroup variant={'outline'}>
          <Button leftIcon={<ArrowBackIcon />} onClick={handleNavigation}>Back</Button>
          <Button leftIcon={<CheckIcon />} colorScheme='purple' onClick={handleSubmit}>Confirm Dive Plan</Button>
        </ButtonGroup>
      </VStack>
    </>
  );
}

export default PlanDiveForm;