import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components"
import { auth, db } from "../firebase";
import blue from '../public/img/blue.png';
import gray from '../public/img/gray.png';
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";

function Message({user, message}) {
  const router = useRouter();
  const [userLoggedIn] = useAuthState(auth);
  let TypeOfMessages = (message.user === userLoggedIn.email) ? Sender : Reciber;
  let Readed = message.beenReaded;
  if(!(message.user === userLoggedIn.email)){
    if(!Readed){
      db.collection("chats").doc(router.query.id).collection("messages").doc(message.messageId).update({
        reactedAt: firebase.firestore.FieldValue.serverTimestamp(),
        beenReaded: true,
      }
      )
    }
    
  }
  const mostrarInformacionMensaje = () => {
    if(message.user !== userLoggedIn.email){
      let mostrarFecha = formatDate(message.reactedAt.toDate())
      if(message.beenReaded) {
        alert(`Message readed at: ${mostrarFecha} `)
      }else {
        alert("No reaccionado")
      }
    }
    
  };

  function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  };

  return (
    <>
    <Container onClick={mostrarInformacionMensaje}>
        <TypeOfMessages>{message.message} <TimeStamp>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</TimeStamp>{Readed ? (<Image src={blue} height={20} width={20}/>) : (<Image src={gray} height={20} width={20}/>)}</TypeOfMessages>
    </Container>
    </>
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


const checks = styled.image`
  width:10%;
  height:10%;
`;