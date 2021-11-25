import styled from 'styled-components';

export const ModalBg = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ModalDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: #282c34;
  border-radius: 0.5rem;
`;
