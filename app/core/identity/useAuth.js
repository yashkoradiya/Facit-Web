import { useSelector } from 'react-redux';

function useAuth() {
  const access = useSelector(state => {
    // console.log(state);
    return state.appState.user.access;
  });

  return access;
}

export default useAuth;
