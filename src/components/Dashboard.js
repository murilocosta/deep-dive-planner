import {
  Grid,
  GridItem,
  Heading,
  Icon,
  VStack
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as ScubaTankSvg } from "../icons/icons8-scuba-tank-100.svg";
import { ReactComponent as ScubaPressureSvg } from "../icons/icons8-scuba-pressure-gauge-100.svg";
import { ReactComponent as ScubaDivingSvg } from "../icons/icons8-scuba-diving-100.svg";

function Dashboard() {
  return (
    <Grid templateColumns='repeat(2, 1fr)' gap={50}>
      <GridItem>
        <Link to={'/tank-setup'}>
          <VStack minH={200} padding={5} borderWidth={2}>
            <Icon as={ScubaTankSvg} boxSize={100} />
            <Heading as='h3' size='sm'>Tank Setup</Heading>
          </VStack>
        </Link>
      </GridItem>

      <GridItem>
        <Link to={'/air-consumption'}>
          <VStack minH={200} padding={5} borderWidth={2}>
            <Icon as={ScubaPressureSvg} boxSize={100} />
            <Heading as='h3' size='sm'>Air Consumption</Heading>
          </VStack>
        </Link>
      </GridItem>

      <GridItem colSpan={2}>
        <Link to={'/dive-plan'}>
          <VStack minH={200} padding={5} borderWidth={2}>
            <Icon as={ScubaDivingSvg} boxSize={100} />
            <Heading as='h3' size='sm'>Dive Plan</Heading>
          </VStack>
        </Link>
      </GridItem>
    </Grid>
  );
}

export default Dashboard;