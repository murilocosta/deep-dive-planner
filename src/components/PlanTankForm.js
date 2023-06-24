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

import { calculateUsableGas } from "../services/calculation";
import { RootStateContext, RootStateDispatchContext } from '../state/RootStateContext';

function PlanTankForm() {
  const navigateTo = useNavigate();

  const { planTank } = useContext(RootStateContext);
  const dispatch = useContext(RootStateDispatchContext);

  const [cylinderCapacity, setCylinderCapacity] = useState(planTank.cylinderCapacity);
  const [fillPresure, setFillPresure] = useState(planTank.fillPresure);
  const [reservePresure, setReservePresure] = useState(planTank.reservePresure);

  const usableGas = useMemo(() => {
    return calculateUsableGas(fillPresure, reservePresure, cylinderCapacity);
  }, [
    cylinderCapacity,
    fillPresure,
    reservePresure,
  ]);

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
    navigateTo("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align={'left'} spacing={10}>
        <Heading as='h2' size='md'>Tank Configuration</Heading>

        <HStack>
          <FormControl>
            <FormLabel>Cylinder Capacity</FormLabel>
            <InputGroup>
              <Input
                type='number'
                name='cylinderCapacity'
                value={cylinderCapacity}
                onChange={(e) => setCylinderCapacity(e.target.value)}
              />
              <InputRightAddon children='liters' />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Fill Presure</FormLabel>
            <InputGroup>
              <Input
                type='number'
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
                name='reservePresure'
                value={reservePresure}
                onChange={(e) => setReservePresure(e.target.value)}
              />
              <InputRightAddon children='bar' />
            </InputGroup>
          </FormControl>
        </HStack>

        <HStack>
          <FormControl>
            <FormLabel>Usable Gas Volume</FormLabel>
            <InputGroup>
              <Input
                readOnly
                variant='filled'
                type='number'
                name='usableGas'
                value={usableGas}
              />
              <InputRightAddon children='liters' />
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

export default PlanTankForm;