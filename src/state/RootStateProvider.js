import { initialState, rootReducer } from './rootReducer'
import { RootStateContext, RootStateDispatchContext } from './RootStateContext';
import { usePersistedReducer } from './usePersistedReducer';

export function RootStateProvider({ children }) {
  const { state, dispatch } = usePersistedReducer(rootReducer, initialState, 'applicationState');

  return (
    <RootStateContext.Provider value={state}>
      <RootStateDispatchContext.Provider value={dispatch}>
        {children}
      </RootStateDispatchContext.Provider>
    </RootStateContext.Provider>
  );
}
