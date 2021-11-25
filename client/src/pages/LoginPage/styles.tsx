import styled from 'styled-components';

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const LoginDiv = styled.div`
  margin: 0 auto;
  padding: 1rem 5rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const LoginInput = styled.input`
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin: 0.25rem 0;
`;

export const ButtonBox = styled.div`
  min-width: 375px;
  max-width: 2560 px;
  height: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;

  & button {
    width: 49%;
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-size: calc(3vw + 2rem);
  margin: 1rem;
`;
