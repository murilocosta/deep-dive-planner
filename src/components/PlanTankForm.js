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
import { CheckIcon } from "@chakra-ui/icons";
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { calculateUsableGas } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from '../state/RootStateContext';
import RootStepper from "./RootStepper";

function PlanTankForm() {
  const navigateTo = useNavigate();

  const { planTank } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  const [cylinderCapacity, setCylinderCapacity] = useState(planTank.cylinderCapacity);
  const [fillPresure, setFillPresure] = useState(planTank.fillPresure);
  const [reservePresure, setReservePresure] = useState(planTank.reservePresure);

  const usableGas = useMemo(
    () => calculateUsableGas(fillPresure, reservePresure, cylinderCapacity),
    [
      cylinderCapacity,
      fillPresure,
      reservePresure,
    ],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch({
      type: 'planTank/setTank',
      payload: {
        cylinderCapacity,
        fillPresure,
        reservePresure,
        usableGas,
        reserveGas: cylinderCapacity * reservePresure,
      },
    });

    dispatch({
      type: 'navigation/setPage',
      payload: 1,
    });

    navigateTo('/air-consumption');
  }

  return (
    <form onSubmit={handleSubmit}>
      <RootStepper />

      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>Tank Configuration</Heading>

        <StatGroup>
          <Stat textColor={'blue.500'}>
            <StatLabel>{'Usable Gas Volume'}</StatLabel>
            <StatNumber>{usableGas || 0} l</StatNumber>
          </Stat>

          <Stat textColor={'orange.500'}>
            <StatLabel>{'Reserve Gas Volume'}</StatLabel>
            <StatNumber>{(cylinderCapacity * reservePresure) || 0} l</StatNumber>
          </Stat>
        </StatGroup>

        <VStack spacing={10}>
          <FormControl>
            <FormLabel>Cylinder Capacity</FormLabel>
            <InputGroup>
              <Input
                type='number'
                min={0}
                name='cylinderCapacity'
                value={cylinderCapacity}
                onChange={(e) => setCylinderCapacity(e.target.value)}
              />
              <InputRightAddon children='l' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Fill Presure</FormLabel>
            <InputGroup>
              <Input
                type='number'
                min={0}
                name='fillPresure'
                value={fillPresure}
                onChange={(e) => setFillPresure(e.target.value)}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Reserve Presure</FormLabel>
            <InputGroup>
              <Input
                type='number'
                min={0}
                name='reservePresure'
                value={reservePresure}
                onChange={(e) => setReservePresure(e.target.value)}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>
        </VStack>

        <ButtonGroup variant={"outline"}>
          <Button leftIcon={<CheckIcon />} colorScheme='purple' type="submit">Confirm Tank</Button>
        </ButtonGroup>
      </VStack>
    </form>
  );
}

export default PlanTankForm;