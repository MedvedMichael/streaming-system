import styled from 'styled-components';

export const StyledButton = styled.button`
  background: #3335b8;
  color: #fff;
  border-radius: 0.5rem;
  border: 1px #6967e2 solid;
  padding: 1rem;
  text-align: center;
  transition: background 0.1s ease;
  &:hover {
    cursor: pointer;
    background: #6163d3;
  }

  &.register {
    margin: 0.75rem;
  }

  &.bold {
    font-size: x-large;
    font-weight: bold;
    padding: 1rem 3rem;
  }

  &.small {
    padding: 0.5rem;
  }
`;
