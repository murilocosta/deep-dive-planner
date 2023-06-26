import { createHashRouter } from 'react-router-dom';

import Dashboard from './components/Dashboard'
import PlanAirConsumptionForm from './components/PlanAirConsumptionForm';
import PlanDiveForm from './components/PlanDiveForm';
import PlanTankForm from './components/PlanTankForm';
import Root from './components/Root';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'tank-setup',
        element: <PlanTankForm />
      },
      {
        path: 'air-consumption',
        element: <PlanAirConsumptionForm />
      },
      {
        path: 'dive-plan',
        element: <PlanDiveForm />
      }
    ],
  },
]);
