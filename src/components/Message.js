import React, { useContext, useMemo } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { formatRelative } from 'date-fns/esm';
import { AppContext } from "../context/AppProvider";
import useFirestore from "../hooks/useFirestore";


function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
}

const Message = ({ message }) => {
    const [user] = useAuthState(auth);
    const { selectedRoom } = useContext(AppContext)


    const condition = useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom.id,
        }),
        [selectedRoom.id]
    );

    const messages = useFirestore('messages', condition);

    return (
        <div
            className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
            <img
                className="chat-bubble__left"
                src={message.avatar}
                alt="user avatar"
            />
            <div className="chat-bubble__right">
                <p className="user-message-created">{formatDate(message.createdAt?.seconds)}</p>
                <p className="user-name">{message.name}</p>
                <p className="user-message">{message.text}</p>
            </div>
        </div>
    );
};


export default Message;

