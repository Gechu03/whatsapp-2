import moment from 'moment';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import blue from '../public/img/blue.png';
import gray from '../public/img/gray.png';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import Popup from 'reactjs-popup';
import { Avatar } from '@material-ui/core';

function Message({ message, avatar }) {
  let muestra;
  const router = useRouter();

  const [userLoggedIn] = useAuthState(auth);
  let TypeOfMessages = message.user === userLoggedIn.email ? Sender : Reciber;
  let Readed = message.beenReaded;
  if (!(message.user === userLoggedIn.email)) {
    if (!Readed) {
      db.collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .doc(message.messageId)
        .update({
          reactedAt: firebase.firestore.FieldValue.serverTimestamp(),
          beenReaded: true,
        });
    }
  }

  const try2 = () => {
    if (message.beenReaded) {
      muestra =
        'The message has been read the: <br/>' +
        formatDate(new Date(message.timestamp));
    } else {
      muestra = 'Message is unread';
    }
  };

  function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' at ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  return (
    <>
      <Container>
        {userLoggedIn.email === message.user ? (
          <StyledPopup
            trigger={
              <TypeOfMessages>
                {message.message}{' '}
                <TimeStamp>
                  {message.timestamp
                    ? moment(message.timestamp).format('LT')
                    : '...'}
                </TimeStamp>
                {Readed ? (
                  <Image src={blue} height={20} width={20} />
                ) : (
                  <Image src={gray} height={20} width={20} />
                )}
              </TypeOfMessages>
            }
            modal
            closeOnDocumentClick
          >
            {try2()}
            <>
              <UserAvatar src={avatar} />
              <div dangerouslySetInnerHTML={{ __html: muestra }}></div>
            </>
          </StyledPopup>
        ) : (
          <TypeOfMessages>
            {message.message}{' '}
            <TimeStamp>
              {message.timestamp
                ? moment(message.timestamp).format('LT')
                : '...'}
            </TimeStamp>
            {Readed ? (
              <Image src={blue} height={20} width={20} />
            ) : (
              <Image src={gray} height={20} width={20} />
            )}
          </TypeOfMessages>
        )}
      </Container>
    </>
  );
}

export default Message;

const Container = styled.div``;

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
  word-wrap: break-word;
`;

const Reciber = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
  max-width: 50%;
  word-wrap: break-word;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
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

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  margin-right: 10px;
  :hover {
    opacity: 0.8;
  }
`;
