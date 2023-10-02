import { useFeeneyStore } from '../../libs/store/store';

export const signOut = () => {
  const { accessToken, setAuthentication, setUser } = useFeeneyStore.getState();
  fetch(
    `https://feeney.interiordesigntools.com/api/users/logout?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    }
  )
    .then(() => {
      setUser(null);
      setAuthentication(false);
      sessionStorage.removeItem('userData');
    })
    .catch((error) => {
      console.error(error);
    });
};
