import React, { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../context/AppProvider';
import { auth, db } from '../../firebase';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const [form] = Form.useForm();

    const handleOk = () => {

        console.log({ formData: form.getFieldsValue() });
        const { uid } = auth.currentUser;
        addDoc(collection(db, "rooms"), { ...form.getFieldsValue(), members: [uid], createdAt: serverTimestamp() });

        form.resetFields();

        setIsAddRoomVisible(false);

    }
    const handleCancel = () => {
        setIsAddRoomVisible(false);
    }

    return (
        <div>
            <Modal
                title='Tạo phòng'
                open={isAddRoomVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label="Tên phòng" name='name'>
                        <Input placeholder='Nhập tên phòng' />
                    </Form.Item>
                    <Form.Item label="Mô tả" name='description'>
                        <Input.TextArea placeholder='Nhập mô tả' />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}

export default AddRoomModal;