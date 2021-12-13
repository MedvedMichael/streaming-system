import styled from 'styled-components';

export const RegistrationDiv = styled.div`
  margin: 0 auto;
  margin-top: 5rem;
  padding: 1rem 5rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const RegistrationInput = styled.input`
  border-radius: 0.25rem;
  margin: 0.25rem 0;
  font-size: 1.25rem;
  padding: 0.5rem;
`;

export const ButtonBox = styled.div`
  min-width: 375px;
  max-width: 2560 px;
  height: auto;
  width: 100%;
  display: flex;
  margin: 0.5rem 0;

  & button {
    width: 100%;
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-size: calc(3vw + 2rem);
  margin: 1rem;
`;
