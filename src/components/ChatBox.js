import React, { useContext, useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
} from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { Avatar, Button, Col, Row, Tooltip, Alert } from "antd";
import RoomList from "./RoomList";
// import { useAuthState } from "react-firebase-hooks/auth";
import styled from 'styled-components';
import { UserAddOutlined } from "@ant-design/icons";
import { AppContext } from "../context/AppProvider";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 27px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  background-color: #d2f3fb;
  width: 84%;
  position: fixed;
  margin-left: -12px;

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;
const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
    // const [user] = useAuthState(auth);
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);

    // const selectedRoom = useMemo(
    //     () => rooms.find((room) => room.id === selectedRoomId),
    //     [rooms, selectedRoomId]
    // )
    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);

            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
        return () => unsubscribe;
    }, []);

    useEffect(() => {
        const scrollToBottom = () => {
            if (scroll.current) {
                scroll.current.scrollTop = scroll.current.scrollHeight;
            }
        };

        scrollToBottom();

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages]);
    return (
        <div className="chat-box">
            <Row>
                <Col span={4} style={{ backgroundColor: '#96cbe6', height: '100%' }}>
                    <RoomList />
                </Col>
                <Col span={20}>
                    {
                        selectedRoom.id ? (
                            <>
                                <HeaderStyled>
                                    <div className="header__info">
                                        <p className="header__title">
                                            {selectedRoom ? selectedRoom.name : ''}
                                        </p>
                                        <span className="header__description">
                                            {selectedRoom ? selectedRoom.description : ''}
                                        </span>
                                    </div>

                                    <ButtonGroupStyled>
                                        <Button icon={<UserAddOutlined />} type="text" onClick={() => setIsInviteMemberVisible(true)}>Mời</Button>
                                        <Avatar.Group size='small' maxCount={2}>
                                            {members.map((member) => (
                                                <Tooltip title={member.displayName} key={member.id} placement="bottom">
                                                    <Avatar src={member.photoURL}>
                                                        {member.photoURL
                                                            ? ''
                                                            : member.displayName?.charAt(0)?.toUpperCase()}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </Avatar.Group>
                                    </ButtonGroupStyled>

                                </HeaderStyled>
                                <div className="messages-wrapper" ref={scroll}>
                                    {messages?.map((message) => (
                                        message.roomId === selectedRoom.id ? (
                                            <Message key={message.id} message={message} />
                                        ) : null
                                    ))}
                                    {/* <div ref={scroll} /> */}
                                </div>
                                <SendMessage />
                            </>
                        ) : <Alert message='Hãy chọn phòng' type='info' showIcon style={{ marginLeft: -12, position: 'fixed', width: '84%' }} closable />
                    }

                </Col>
            </Row>

        </div>

    );
};

export default ChatBox;

