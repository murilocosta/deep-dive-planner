import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { DeleteIcon, SmallCloseIcon } from "@chakra-ui/icons";
import React, { useContext, useMemo } from "react";

import { RootStateDispatchContext } from "../state/RootStateContext";

function DivePlanTripManager({ trips, isOpen, onClose }) {
  const dispatch = useContext(RootStateDispatchContext);

  const calculateTotal = (total, current) => total + Number(current.gasUsed);
  const totalGasUsed = useMemo(() => trips.reduce(calculateTotal, 0), [trips]);

  const handleRemoveTrip = (removeIndex) => {
    dispatch({
      type: 'planDive/removeTrip',
      payload: removeIndex,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Trip Management</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Depth</Th>
                  <Th>Duration</Th>
                  <Th>Gas Used</Th>
                  <Th></Th>
                </Tr>
              </Thead>

              <Tbody>
                {trips.map((trip, index) => (
                  <Tr key={index}>
                    <Td>{trip.depth} m</Td>
                    <Td>{trip.duration} min</Td>
                    <Td>{trip.gasUsed.toFixed(2)} l</Td>
                    <Td>
                      <IconButton
                        colorScheme='red'
                        aria-label='Remove Trip'
                        icon={<DeleteIcon />}
                        onClick={() => handleRemoveTrip(index)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>

              <Tfoot>
                <Tr>
                  <Th colSpan={2}>Total Gas Used</Th>
                  <Td>{totalGasUsed.toFixed(2)} l</Td>
                  <Td></Td>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button leftIcon={<SmallCloseIcon />} colorScheme='red' mr={3} onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DivePlanTripManager;
