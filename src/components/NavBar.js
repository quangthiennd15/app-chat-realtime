import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, Typography } from 'antd';
const NavBar = () => {
    const [user] = useAuthState(auth);

    const signOut = () => {
        auth.signOut();
    };

    return (
        <div>
            {user ? (
                <nav className="nav-bar">
                    <Avatar src={user.photoURL} >{user.photoURL ? '' : user.displayName?.chatAt(0)?.toUpperCase()}</Avatar>
                    <Typography.Text className="username" style={{ width: '90%' }}>{user.displayName}</Typography.Text>
                    <button onClick={signOut} className="sign-out" type="button">
                        Đăng xuất
                    </button>
                </nav>

            ) : (
                <nav className="nav-bar">
                    <h1>Chat Fun </h1>
                </nav>
            )}
        </div>


    );
};

export default NavBar;