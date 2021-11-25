import { ModalBg, ModalDiv } from './styles';

interface ModalProps {
  children?: React.ReactNode;
  onClose: () => void;
}
export default function Modal({ children, onClose }: ModalProps): JSX.Element {
  return (
    <ModalBg
      id="bg"
      onClick={({
        target,
      }: React.MouseEvent<HTMLDivElement> & { target: { id: string } }): void =>
        target.id === 'bg' ? onClose() : undefined
      }
    >
      <ModalDiv>{children}</ModalDiv>
    </ModalBg>
  );
}
