import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { RootStateContext } from "../state/RootStateContext";

const pages = [
  {title: 'Setup Tank', description: '', link: '/tank-setup'},
  {title: 'Setup Air Consumption', description: '', link: '/air-consumption'},
  {title: 'Setup Dive Plan', description: '', link: '/dive-plan'},
];

function RootStepper() {
  const { navigation } = useContext(RootStateContext);

  const { activeStep } = useSteps({
    index: navigation.activePage,
    count: pages.length,
  });

  return (
    <Stepper index={activeStep} marginBottom={20}>
      {pages.map((page, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{page.title}</StepTitle>
            <StepDescription>{page.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}

export default RootStepper;