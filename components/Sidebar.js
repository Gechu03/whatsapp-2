import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVert from "@material-ui/icons/MoreVert";
import Search from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection} from "react-firebase-hooks/firestore"
import { auth, db} from "../firebase"
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection("chats").where('users', 'array-contains', user.email);
  const [chatsSnapshot] = useCollection(userChatRef);


const createChat = () => {
    const input = prompt('Please enter an email addres for the user you wish to chat with');
    
    if (!input) return null;

    if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      db.collection("chats").add({
        users: [user.email,  input],
      })
    }



}

  const chatAlreadyExists = (recipientEmail) => 
    !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0);
  
  
  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>
      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in chats" />
      </SearchContainer>

      <SidebarButton onClick={createChat}>
        Start a new Chat
      </SidebarButton>

      {/* List of Chats */}
      {chatsSnapshot?.docs.map(chat => (
        
        <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
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
    display:none;
  };

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
display:flex;
position:sticky;
top: 0;
background-color: white;
z-index:1;
justify-content: space-between;
align-items:center;
padding:15px;
height: 80px;
border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor:pointer;
  :hover {
    opacity: 0.8;
  }

  
`;

const IconsContainer = styled.div`
&&&{
        @media screen and (max-width: 500px) {
        display: none;
    };
    }
`;

const SearchContainer = styled.div`
  display:flex;
  align-items:center;
  padding: 20px;
  border-radius: 2px;

`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  padding-left: 1%;
`;