import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from 'components/styled/styled-button';
import { login, responseGoogle } from 'services/auth.service';
import chatStore from 'stores/store';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { ErrorValidation } from 'components/styled/error-validation';
import { ButtonBox, LoginDiv, LoginForm, LoginInput, Title } from './styles';
import { observer } from 'mobx-react';

export default observer(function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    const { user } = chatStore;
    if (user) {
      history.push('/users/' + user._id);
    }
  }, [history, chatStore?.user]);
  const handleGoogleClick = async (res: GoogleLoginResponse): Promise<void> => {
    try {
      const { accessToken } = await responseGoogle(res);
      await chatStore.setAccessToken(accessToken);
      history.push('/chat');
    } catch (error) {
      setShowError(true);
    }
  };

  const setToken = async (): Promise<void> => {
    try {
      const { accessToken } = await login(email, password);
      await chatStore.setAccessToken(accessToken);
      history.push('/chat');
    } catch (error) {
      setShowError(true);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await setToken();
  };

  return (
    <LoginDiv>
      <Title>Login</Title>
      <LoginForm onSubmit={handleSubmit}>
        <label>Email</label>
        <LoginInput
          type="email"
          value={email}
          onChange={(ev): void => setEmail(ev.target.value)}
        />

        <label>Password</label>
        <LoginInput
          type="password"
          value={password}
          onChange={(ev): void => setPassword(ev.target.value)}
        />
        {showError ? <ErrorValidation>ERROR!</ErrorValidation> : null}
        <ButtonBox>
          <StyledButton>Sign in</StyledButton>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
            buttonText="Login"
            onSuccess={(res): Promise<void> =>
              handleGoogleClick(res as GoogleLoginResponse)
            }
            cookiePolicy={'single_host_origin'}
          />
        </ButtonBox>
      </LoginForm>
      <StyledButton onClick={(): void => history.push('/registration')}>
        Sign up
      </StyledButton>
    </LoginDiv>
  );
});
