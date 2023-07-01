import { createHashRouter } from 'react-router-dom';

import PlanAirConsumptionForm from './components/PlanAirConsumptionForm';
import PlanDiveForm from './components/PlanDiveForm';
import PlanTankForm from './components/PlanTankForm';
import Root from './components/Root';
import ShowDivePlan from './components/ShowDivePlan';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'tank-setup?',
        element: <PlanTankForm />
      },
      {
        path: 'air-consumption',
        element: <PlanAirConsumptionForm />
      },
      {
        path: 'dive-plan',
        element: <PlanDiveForm />
      },
      {
        path: 'show-dive-plan',
        element: <ShowDivePlan />
      }
    ],
  },
]);
