import { Flex, Text, Image,Form, TextField, DialogTrigger, View, Dialog, Heading, Divider, Content, ButtonGroup, Button } from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import { useRequestCreate } from "../../../api/requests/hooks/use-request-create.hook";
import { isEmpty } from "../../../helpers/utils";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";

export const ProductComponent = (): JSX.Element => {

    const navigate = useNavigate();
    const { productId = '' } = useParams<{
        productId: string;
    }>();

    const [user, setUser] = useState<any>({userId: '', password: ''});
    const [connection, setConnection] = useState<any>(undefined);

    const { product } = useProduct({id: productId});
    const { create: createConnection} = useConnectionCreate();
    const { edit: editConnection} = useConnectionEdit();
    const { create: createRequest, isInProgress } = useRequestCreate();

    const handleCreate = useCallback(() => {
        createRequest({...user, productId: productId}).then((res) => {
            navigate(PATHS.getRequestUrl(res._id))
        })
        .catch((e)=> {console.log(e)})
    }, [user]);

    useEffect(() => {
        if (product && !connection) {
            createConnection({
                device: /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile': 'pc',
                product: productId,
                page: '메인',
                duration: 0,
            }).then(( res) => {
                setConnection(res);
            }).catch( e => {console.log(e)})
        }
    }, [product, connection]);

    useEffect(() => {
    
        const timer = setInterval(() => {
            setConnection((prev: any) => {
                if (prev) {
                    try {
                        editConnection(prev._id,{duration: prev.duration + 1} ).catch((e) => {});
                    } catch (error) {
                        
                    }
                    return {...prev, duration: prev.duration + 1}
                }
                return prev;
            })
        }, 1000);
    
        return () => clearInterval(timer);
    
      }, []); 

    if (!product) return <></>
    if (isInProgress) return <LoadingIndicator></LoadingIndicator>
    
    return (
        <>
        <Flex
            direction="column"
            flex={1}
            gap="size-100"
            position="relative"
        >
            <Flex gap={"size-100"}>
                <Flex width="200px">
                    <Image src={product.image} />
                </Flex>
                <Flex direction={"column"} gap={"size-100"}>
                    <Text UNSAFE_style={{}}>{product.name}</Text>
                    <Text UNSAFE_style={{ fontWeight: 'bolder'}}>{ new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}</Text>
                    <View flex={1}></View>
                    <Flex>
                        <DialogTrigger>
                            <Button variant="accent" minWidth={"size-2000"}>안전결제하기</Button>
                            {(close) => (
                                <Dialog>
                                <Heading>구매하기</Heading>
                                <Divider />
                                <Content>
                                    <Text>
                                    선택하신 { product.name} (1개)를 구매하시겠습니까?
                                    </Text>
                                    <br></br>
                                    <Text>
                                    구매가격 : <Text UNSAFE_style={{ fontWeight: 'bolder'}}>{ new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}</Text>
                                    </Text>
                                </Content>
                                <ButtonGroup>
                                    <DialogTrigger>
                                        <Button variant="accent" style="fill"autoFocus>예</Button>
                                        {(close1) => (
                                            <Dialog>
                                            <Content>
                                                <Flex direction={"column"} alignItems={"center"} UNSAFE_style={{overflow: "hidden"}} >
                                                    <Form
                                                        labelPosition="side"
                                                        width={"size-3600"}
                                                        labelAlign="start">
                                                        <TextField label="아이디" value={user.userId} onChange={(value) => {
                                                        setUser({...user, userId: value});
                                                        }} isRequired />
                                                        <TextField label="비밀번호" type="password" value={user.password} onChange={(value) => {
                                                        setUser({...user, password: value});
                                                        }} isRequired/>
                                                    </Form>
                                                    <Button isDisabled={isEmpty(user.userId) || isEmpty(user.password)} marginTop={"size-800"} width={"size-3600"} variant="accent" style="fill" onPress={() => {close1(); close(); handleCreate()}}>로그인</Button>
                                                </Flex>
                                            </Content>
                                            </Dialog>
                                        )}
                                    </DialogTrigger>
                                    <Button variant="secondary" style="fill" onPress={close}>아니오</Button>
                                </ButtonGroup>
                                </Dialog>
                            )}
                        </DialogTrigger>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
        </>
    );
};
