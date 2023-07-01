import { Button, ButtonGroup, VStack } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import { buildWholeDive } from "../services/buildWholeDive";
import { RootStateContext } from "../state/RootStateContext";
import DivePlanTripChart from "./DivePlanTripChart";

function ShowDivePlan() {
  const { planDive } = useContext(RootStateContext);

  const wholeDive = useMemo(() => buildWholeDive(planDive), [planDive]);

  return (
    <VStack align={'left'} spacing={10}>
      <DivePlanTripChart trips={wholeDive} />

      <ButtonGroup variant={"outline"}>
        <Button as={Link} to="/dive-plan">Back</Button>
      </ButtonGroup>
    </VStack>
  );
}

export default ShowDivePlan;
