import { FormControl, HStack, Heading, VStack } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

function PlanAscentRateForm({ targetDepth, rmv, cylinderCapacity, onConfirm }) {
  const [ascentRate, setAscentRate] = useState(9);

  const ascentTime = useMemo(() => {
    return targetDepth / ascentRate;
  }, [
    targetDepth,
    ascentRate,
  ]);

  const ascentGasConsumption = useMemo(() => {
    return rmv * ascentTime / cylinderCapacity;
  }, [
    rmv,
    ascentTime,
    cylinderCapacity,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({ ascentRate, ascentTime, ascentGasConsumption });
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align={'left'} spacing={10}>
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
        </HStack>

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

export default PlanAscentRateForm;