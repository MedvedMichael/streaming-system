import styled from 'styled-components';

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin: 1rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const AvatarImage = styled.img`
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  width: 20rem;
  height: 21rem;
  background-image: url('/man.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  &.womanImg {
    background-image: url('/women.jpg');
  }
`;

export const ProfileBlockView = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 0 1rem;
`;
export const InfoBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  justify-content: space-evenly;
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailInfo = styled.h3`
  text-align: center;
  display: flex;
  margin: 0.25rem;
`;

export const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  & * {
    margin: 0 0.25rem;
  }
`;

export const EditInput = styled.input`
  border-radius: 0.25rem;
  margin: 0.5rem 0;
  font-size: 1.25rem;
  padding: 0.5rem;
`;

export const SelectSex = styled.div`
  font-size: 20px;
`;

export const SelectZodiac = styled.select`
  margin: 0.5rem;
  font-size: 25px;
  max-width: 30rem;
  min-width: 10rem;
`;

export const Label = styled.label`
  margin: 0.25rem;
`;

export const SexBlock = styled.div`
  display: flex;
  padding: 0.5rem 0;
  justify-content: space-between;
`;
