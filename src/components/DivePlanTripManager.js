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
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import React, { useContext } from "react";

import { RootStateDispatchContext } from "../state/RootStateContext";

function DivePlanTripManager({ trips, isOpen, onClose }) {
  const dispatch = useContext(RootStateDispatchContext);

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
                  <Th isNumeric>Depth</Th>
                  <Th isNumeric>Duration</Th>
                  <Th isNumeric>Gas Used</Th>
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
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DivePlanTripManager;
