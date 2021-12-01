import { observer } from "mobx-react";
import {
  Title,
  AvatarImage,
  ProfileBlockView,
  DetailInfo,
  InfoBlock,
  ProfileDetails,
  ButtonBlock,
  EditInput,
  SelectSex,
  SelectZodiac,
  Label,
  Form,
  SexBlock,
} from "./styles";
import chatStore, { reloadChatStore } from "stores/store";
import { useParams } from "react-router";
import {
  changeMyPassword,
  changeMyStreamKey,
  getUserProfile,
  patchMyProfile,
} from "services/users.service";
import { useEffect, useState } from "react";
import User, {
  IProfile,
  IProfileWithProviders,
} from "interfaces/User.interface";
import { useHistory } from "react-router-dom";
import Modal from "components/modal/modal";
import { StyledButton } from "components/styled/styled-button";
import { logout } from "services/auth.service";

export default observer(function ProfilePage(): JSX.Element {
  const [user, setUser] = useState<IProfileWithProviders>();
  const [newUserInfo, setNewUserInfo] = useState<IProfile>();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const getProfile = async (): Promise<void> => {
    try {
      const profileUser = await getUserProfile(chatStore.accessToken, id);
      setUser(profileUser);
      setNewUserInfo(profileUser);
    } catch {
      history.push("/");
    }
  };

  useEffect(() => {
    if (chatStore.initialized) {
      getProfile();
    }
  }, [chatStore.initialized, params]);

  if (!user) return <div></div>;

  const changeProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!newUserInfo?.nickname) return alert("Type your name");
    const { nickname } = newUserInfo;
    await patchMyProfile(chatStore.accessToken, {
      nickname,
    });
    chatStore.setUser(newUserInfo);
    setUser((u) => ({
      ...newUserInfo,
      authProviders: u?.authProviders as string[],
    }));
    setShowModal(false);
  };

  const changePassword = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (newPassword !== repeatNewPassword) {
      return alert("Please repeat correctly password");
    }

    try {
      const { accessToken } = await changeMyPassword(
        chatStore.accessToken,
        oldPassword,
        newPassword
      );
      chatStore.setAccessToken(accessToken);
      setShowChangePasswordModal(false);
    } catch {
      alert("Something went wrong!");
    }
  };

  const modal = showModal ? (
    <Modal onClose={(): void => setShowModal(false)}>
      <Form onSubmit={changeProfile}>
        <Label>Enter your nickname</Label>
        <EditInput
          value={newUserInfo?.nickname}
          onChange={({ target }): void =>
            setNewUserInfo((u) => ({
              ...(u as User),
              firstName: target.value,
            }))
          }
          type="text"
        />
        <StyledButton>Save changes</StyledButton>
      </Form>
    </Modal>
  ) : null;

  const changePasswordModal = showChangePasswordModal ? (
    <Modal onClose={(): void => setShowChangePasswordModal(false)}>
      <Form onSubmit={changePassword}>
        <Label>Confirm your password</Label>
        <EditInput
          value={oldPassword}
          onChange={({ target }): void => setOldPassword(target.value)}
          type="password"
        />

        <Label>Enter new password</Label>
        <EditInput
          value={newPassword}
          onChange={({ target }): void => setNewPassword(target.value)}
          type="password"
        />

        <Label>Repeat new password</Label>
        <EditInput
          value={repeatNewPassword}
          onChange={({ target }): void => setRepeatNewPassword(target.value)}
          type="password"
        />
        <StyledButton>Change password</StyledButton>
      </Form>
    </Modal>
  ) : null;

  const makeNewChat = async (): Promise<void> => {
    const oldChat = chatStore.chats.find(
      (c) => c.senderInfo.senderID === user._id
    );
    if (!oldChat) {
      const chatId = await chatStore.addNewChat(user._id);
      return history.push(`/chat?chatID=${chatId}`);
    }
    history.push(`/chat?chatID=${oldChat?.chatID}`);
  };

  const changeStreamingKey = async () => {
    const {streamKey} = await changeMyStreamKey(chatStore.accessToken);
    setUser(u => ({...u, streamKey} as IProfileWithProviders))
  };

  const changeProfileButton = (
    <StyledButton
      onClick={(): void => {
        setShowModal(true);
      }}
    >
      Change profile
    </StyledButton>
  );

  const changePasswordButton = user.authProviders.includes("local") ? (
    <StyledButton onClick={(): void => setShowChangePasswordModal(true)}>
      Change password
    </StyledButton>
  ) : null;

  const changeStreamKeyButton = (
    <StyledButton onClick={changeStreamingKey}>
      Change Streaming Key
    </StyledButton>
  );

  const logoutButton = (
    <StyledButton
      onClick={async () => {
        await logout();
        reloadChatStore();
        window.location.reload();
      }}
    >
      Logout
    </StyledButton>
  );

  return (
    <ProfileBlockView>
      {modal}
      {changePasswordModal}
      <Title>Profile</Title>
      <InfoBlock>
        <ProfileDetails>
          <DetailInfo>Nickname: {user?.nickname}</DetailInfo>
          <DetailInfo>Email: {user?.email}</DetailInfo>
          <DetailInfo>Streaming Key: {user?.streamKey}</DetailInfo>
        </ProfileDetails>
      </InfoBlock>
      <ButtonBlock>
        {user?._id === chatStore?.user._id ? (
          <>
            {changeProfileButton}
            {changePasswordButton}
            {changeStreamKeyButton}
            {logoutButton}
          </>
        ) : (
          <StyledButton onClick={makeNewChat}>Write a message</StyledButton>
        )}
      </ButtonBlock>
    </ProfileBlockView>
  );
});
