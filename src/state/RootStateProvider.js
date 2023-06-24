import { useReducer } from 'react';

import { initialState, rootReducer } from './rootReducer'
import { RootStateContext, RootStateDispatchContext } from './RootStateContext';

export function RootStateProvider({ children }) {
  const [rootState, dispatch] = useReducer(rootReducer, initialState);

  return (
    <RootStateContext.Provider value={rootState}>
      <RootStateDispatchContext.Provider value={dispatch}>
        {children}
      </RootStateDispatchContext.Provider>
    </RootStateContext.Provider>
  );
}
