import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon, MoreVert } from "@material-ui/icons";
import { AttachFile } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import Mic from "@material-ui/icons/Mic";
import { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessagesRef = useRef(null);

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [input, setInput] = useState("");
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(
        (message) => (
          console.log("User passed", message.data()),
          (
            <Message
              key={message.data().id}
              user={message.data().user}
              message={{
                ...message.data(),
                timestamp: message.data().timestamp?.toDate().getTime(),
              }}
            />
          )
        )
      );
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const sendMesssage = (e) => {
    // Update the last seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const RecipientEmail = getRecipientEmail(chat.users, user);
  console.log("Recipient Info", recipientSnapshot);
  return (
    <Container>

      <Header>
      <ResponsibleDesign>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{RecipientEmail[0]}</Avatar>
        )}
      </ResponsibleDesign>
        <HeaderInformation>
          <h3>{RecipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active</p>
          )}
        </HeaderInformation>
        <ResponsibleDesign>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
            <MoreVert />
          </IconButton>
        </HeaderIcons>
        </ResponsibleDesign>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessages ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <ResponsibleDesign>
          <InsertEmoticon />
        </ResponsibleDesign>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          hidden
          disabled={!input}
          type="submit"
          onClick={sendMesssage}
        ></button>
        <ResponsibleDesign>
          <Mic />
        </ResponsibleDesign>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`

`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 20px;
  background-color: whitesmoke;
  width: 80%;
  &&& {
    @media screen and (max-width: 500px) {
      width: 100%;
      padding: 20px;
      margin: 0;
    }
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: absolute;
  bottom: -3px;
  background-color: white;
  z-index: 1001;
  width: 66.7%;
`;

const Header = styled.div`
&&&{
  position: sticky;
}
  
  background-color: white;
  z-index: 10002;
  top: 0;
  display: flex;
  padding: 11px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  width: 100%;
  height: 15%;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  word-break: break-all;
  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const EndOfMessages = styled.div`
  margin-bottom: 50px;
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
  z-index: 10;
  &&& {
    @media screen and (max-width: 500px) {
      padding:5px 5px  50px 5px;
    }
  }
`;

const ResponsibleDesign = styled.div`
  &&& {
    @media screen and (max-width: 500px) {
      display: none;
    }
  }
`;
