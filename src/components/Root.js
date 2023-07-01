import {
  ChakraProvider,
  Divider,
  Grid,
  HStack,
  Heading,
  theme,
} from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { RootStateProvider } from '../state/RootStateProvider';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function Root() {
  return (
    <ChakraProvider theme={theme}>
      <Grid gap={5} m={5}>
        <HStack justifyContent={'space-between'}>
          <Heading>{'Deep Dive Planner v1'}</Heading>
          <ColorModeSwitcher />
        </HStack>

        <Divider marginBottom={10} />
        
        <RootStateProvider>
          <Outlet />
        </RootStateProvider>
      </Grid>
    </ChakraProvider>
  );
}

export default Root;
