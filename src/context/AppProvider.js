import React, { createContext, useMemo, useState } from 'react';

import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import useFirestore from '../hooks/useFirestore';

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [user] = useAuthState(auth);

    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: user.uid
        }
    }, [user.uid])

    const rooms = useFirestore('rooms', roomsCondition);
    const selectedRoom = useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    )

    const usersConditions = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        }
    }, [selectedRoom.members])
    console.log(usersConditions);
    const members = useFirestore('users', usersConditions);
    console.log({ members });
    return (
        <AppContext.Provider value={{ rooms, members, isAddRoomVisible, setIsAddRoomVisible, selectedRoomId, setSelectedRoomId, selectedRoom, isInviteMemberVisible, setIsInviteMemberVisible }}>
            {children}
        </AppContext.Provider>
    )
}