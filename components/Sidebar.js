import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVert from "@material-ui/icons/MoreVert";
import Search from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";
import { useState } from "react";
import Popup from "reactjs-popup";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  const [search, setSearch] = useState("");
  const [crearChat, setCrearChat] = useState(false);

  const createChat = () => {
    if (!crearChat) return null;

    if (
      EmailValidator.validate(crearChat) &&
      !chatAlreadyExists(crearChat) &&
      crearChat !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, crearChat],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header >
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <MoreVert/>
          </IconButton>
        </IconsContainer>
      </Header>
      {/* Create chat */}

      <StyledPopup
        trigger={<SidebarButton>Start a new Chat</SidebarButton>}
        modal
        closeOnDocumentClick
      >
        <SearchContainer>
          <ChatIcon />
          <SearchInput1
            type="text"
            placeholder="Search..."
            onChange={(event) => {
              setCrearChat(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                createChat();
              }
            }}
          />
        </SearchContainer>
      </StyledPopup>

      <SearchContainer>
        <Search />
        <SearchInput
          placeholder="Search in chats"
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      {/* List of Chats */}
      {chatsSnapshot?.docs
        .filter((chat) => {
          if (
            chat.data().users[0].includes(search) &&
            chat.data().users[0] !== user.email
          )
            return chat;
          if (
            chat.data().users[1].includes(search) &&
            chat.data().users[1] !== user.email
          )
            return chat;
        })
        .map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.5;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 10%;
  max-width: 35%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div`
  &&& {
    @media screen and (max-width: 500px) {
      display: none;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  padding-left: 1%;
`;

const SearchInput1 = styled.input`
  outline-width: 1;
  border: 2px solid whitesmoke;
  flex: 1;
  padding-left: 1%;
  padding: 10px;
`;

const StyledPopup = styled(Popup)`
  &-overlay {
    height: 20%;
    width: 40%;
    background-color: white;
    position: absolute;
    margin-top: 20%;
    margin-left: 45%;
    padding: 10px;

    &&& {
      @media screen and (max-width: 500px) {
        position: fixed;
        width: 60%;
        padding: 20px;
        margin: 0;
        height: 35%;
        overflow: hidden;
        justify-content: center;
        margin-top: 50%;
        margin-left: 36%;
      }
    }
  }

  &-content {
    display: flex;
    font-size: 25px;
    padding: 10px;
    align-items: center;
    &&& {
      @media screen and (max-width: 500px) {
        padding: 0px;
        font-size: 17px;
      }
    }
  }
`;
