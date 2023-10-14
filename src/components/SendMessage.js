import React, { useContext, useState, useMemo } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AppContext } from "../context/AppProvider";
import useFirestore from "../hooks/useFirestore";

const SendMessage = ({ scroll }) => {
    const { selectedRoom } = useContext(AppContext)

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Bạn chưa nhập tin nhắn!");
            return;
        }
        // const { uid, displayName, photoURL } = auth.currentUser;
        // await addDoc(collection(db, "messages"), {
        //     text: message,
        //     name: displayName,
        //     avatar: photoURL,
        //     createdAt: serverTimestamp(),
        //     uid,
        //     roomId: selectedRoom.id
        // });
        // setMessage("");


        // window.scrollTo({
        //     top: document.body.scrollHeight,
        //     behavior: 'smooth'
        // });

        const { uid, displayName, photoURL } = auth.currentUser;

        const newMessage = {
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: new Date(),
            uid,
            roomId: selectedRoom.id
        };

        setMessages([...messages, newMessage]);

        try {
            await addDoc(collection(db, 'messages'), newMessage);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
        }

        setMessage('');
    };


    return (
        <div>
            <form onSubmit={(event) => sendMessage(event)} className="send-message">
                <label htmlFor="messageInput" hidden>
                    Enter Message
                </label>
                <input
                    id="messageInput"
                    name="messageInput"
                    type="text"
                    className="form-input__input"
                    placeholder="Nhập tin nhắn ..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete='off'
                />

                <button type="submit" >Gửi</button>
            </form>
        </div>

    );
};

export default SendMessage;