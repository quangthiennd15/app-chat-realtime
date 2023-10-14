import React, { useContext, useMemo, useState } from 'react';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import { AppContext } from '../../context/AppProvider';
// import { auth } from '../../firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { debounce } from "lodash";
import { db } from '../../firebase/config';

function DebounceSelect({ fetchOptions, debounceTimeOut = 300, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true)

            fetchOptions(value, props.curMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeOut);
    }, [debounceTimeOut, fetchOptions]);
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {
                options && options.length > 0 ? (
                    options.map(opt => (
                        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                            <Avatar size='small' src={opt.photoURL}>
                                {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            {`${opt.label}`}
                        </Select.Option>
                    ))
                ) : null
            }
        </Select>
    )
}
async function fetchUserList(search, curMembers) {
    const q = query(
        collection(db, 'users'),
        where('keywords', 'array-contains', search),
        orderBy('displayName'),
        limit(20)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL
    })).filter((opt) => !curMembers.includes(opt.value));;
}
function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const [form] = Form.useForm();
    // const { uid } = auth.currentUser;
    const [value, setValue] = useState([]);

    const handleOk = () => {
        const roomRef = doc(db, 'rooms', selectedRoomId);
        const updatedData = {
            members: [...selectedRoom.members, ...value.map((val) => val.value)]
        };

        updateDoc(roomRef, updatedData)
        form.resetFields();

        setIsInviteMemberVisible(false);

    }
    const handleCancel = () => {
        form.resetFields();

        setIsInviteMemberVisible(false);

    }
    console.log({ value });

    return (
        <div>
            <Modal
                title='Mời thêm thành viên'
                open={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        label='Tên các thành viên'
                        value={value}
                        placeholder='Nhập tên thành viên'
                        fetchOptions={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>

        </div>
    );
}

export default InviteMemberModal;