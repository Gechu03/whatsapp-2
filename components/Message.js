import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { auth } from "../firebase";

function Message({user, message}) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessages = user === userLoggedIn.email ? Sender : Reciber;

  return (
    <Container>
        <TypeOfMessages>{message.message} <TimeStamp>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</TimeStamp></TypeOfMessages>
    </Container>
  )
}

export default Message

const Container = styled.div`

`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;


const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
  max-width: 50%;
  word-wrap:break-word;
`;

const Reciber = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
  max-width: 50%;
  word-wrap:break-word;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`