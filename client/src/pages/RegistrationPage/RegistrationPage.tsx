import { observer } from "mobx-react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { register } from "services/auth.service";
import { ErrorValidation } from "components/styled/error-validation";
import { StyledButton } from "components/styled/styled-button";
import {
  RegistrationDiv,
  RegistrationForm,
  RegistrationInput,
  Title,
} from './styles';
import chatStore from "stores/store";

export default observer(function RegistrationPage(): JSX.Element {
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const history = useHistory();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const { accessToken } = await register(nickname, email, password);
      chatStore.setAccessToken(accessToken);
      history.push("/extra-page");
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <RegistrationDiv>
      <Title>User Registration</Title>
      <RegistrationForm onSubmit={handleSubmit}>
        <label>Nickname</label>
        <RegistrationInput
          value={nickname}
          onChange={(ev): void => setNickname(ev.target.value)}
          type="text"
        />
        <label>Email</label>
        <RegistrationInput
          value={email}
          onChange={(ev): void => setEmail(ev.target.value)}
          type="email"
        />
        <label>Password</label>
        <RegistrationInput
          value={password}
          onChange={(ev): void => setPassword(ev.target.value)}
          type="password"
        />
        {showError ? (
          <ErrorValidation className="small">
            Password should contain at least 1 uppercase letter, 1 lowercase
            letter and one symbol
          </ErrorValidation>
        ) : null}
        {showError ? <ErrorValidation>Check email and password</ErrorValidation> : null}
        <StyledButton className="register">Register now</StyledButton>
      </RegistrationForm>
      <StyledButton
        className="register"
        onClick={(): void => history.push("/")}
      >
        Back to Login page
      </StyledButton>
    </RegistrationDiv>
  );
});
