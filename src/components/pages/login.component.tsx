import { Button, Flex, Form, TextField, View } from "@adobe/react-spectrum";
import { useState } from "react";
import { isEmpty } from "../../helpers/utils";
import AXIOS from '../../api/axios-instance';
import { useNotification } from "../shared/notification/notification.component";
import { NOTIFICATION_TYPE } from "../shared/notification/notification-toast/notification-type.enum";
import { LOCAL_STORAGE_KEYS } from "../../helpers/local-storage-keys";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): JSX.Element => {

    const [credential, setCredential] = useState<any>({userId: '', password: ''});
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const handleLogin = () => {
        AXIOS.post(`${process.env.REACT_APP_API_URL}/login`, credential).then ( res => {
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTHORIZED, 'true');
            navigate('/')
        }).catch(error => {
            addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        })
    }
    return (
        <Flex direction={"column"} alignItems={"center"} UNSAFE_style={{overflow: "hidden"}} marginTop={"size-1600"} >
            <Form
                labelPosition="side"
                width={"size-3600"}
                labelAlign="start">
                <TextField label="아이디" value={credential.userId} onChange={(value) => {
                setCredential({...credential, userId: value});
                }} isRequired />
                <TextField label="비밀번호" type="password" value={credential.password} onChange={(value) => {
                setCredential({...credential, password: value});
                }} isRequired/>
            </Form>
            <Button isDisabled={isEmpty(credential.userId) || isEmpty(credential.password)} marginTop={"size-800"} width={"size-3600"} variant="accent" 
            style="fill" onPress={handleLogin}>로그인</Button>
        </Flex>
    );
};

export default LoginPage;
