import React, { useContext } from "react";
import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../context/AppProvider";
// import { query, orderBy, onSnapshot, limit, addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase";



const { Panel } = Collapse;

const SidebarStyled = styled.div`
    background: #96cbe6;
    color: blue;
    height: 100vh;
    position: fixed;
    width: 16%;
`;


const PanelStyled = styled(Panel)`
    &&& {
        
        .ant-collapse-header, p{
            color: blue;
            
        }

        .ant-collapse-content-box {
            padding: 0 40px;
        
        }

        .add-room{
            color: blue;
            padding: 0;
        }
    }
`;

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: white;
`;

export default function RoomList() {

    const { rooms, setIsAddRoomVisible, setSelectedRoomId } = useContext(AppContext);

    const handleAddRoom = () => {
        // console.log("hi");
        setIsAddRoomVisible(true);
    }


    // useEffect(() => {
    //     const q = query(
    //         collection(db, "rooms"),
    //         orderBy("createdAt", "desc"),
    //         limit(50)
    //     );

    //     const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    //         const fetchedRoomList = [];
    //         QuerySnapshot.forEach((doc) => {
    //             fetchedRoomList.push({ ...doc.data(), id: doc.id });
    //         });
    //         const sortedRoomList = fetchedRoomList.sort(
    //             (a, b) => a.createdAt - b.createdAt
    //         );
    //         setRoomList(sortedRoomList);
    //     });
    //     return () => unsubscribe;
    // }, []);


    return (
        <SidebarStyled>
            <Collapse ghost defaultActiveKey={['1']}>
                <PanelStyled header="Danh sách các phòng" key='1'>
                    {

                        rooms.map((room) => (<LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>{room.name}</LinkStyled>))
                    }

                    <Button type="text"
                        icon={<PlusSquareOutlined />}
                        className="add-room"
                        onClick={handleAddRoom}
                    >Thêm phòng
                    </Button>
                </PanelStyled>
            </Collapse>
        </SidebarStyled>

    )
}