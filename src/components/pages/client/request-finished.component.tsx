import { Flex, Text, LabeledValue, Button } from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
import { useRequest } from "../../../api/requests/hooks/use-request.hook";
import { useInformation } from "../../../api/information/hooks/use-information.hook";
import { size } from "lodash";

export const RequestFinishedComponent = (): JSX.Element => {

    const { requestId = '' } = useParams<{
        requestId: string;
    }>();

    const { request} = useRequest({id: requestId});
    const { information } = useInformation();
    const [ connection, setConnection] = useState<any>(undefined);
    const { create: createConnection} = useConnectionCreate();
    const { edit: editConnection} = useConnectionEdit();

    useEffect(() => {
        if (request && !connection) {
            createConnection({
                device: /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile': 'pc',
                product: request.product?._id,
                page: '완료',
                duration: 0,
            }).then(( res) => {
                setConnection(res);
            }).catch( e => {console.log(e)})
        }
    }, [request, connection]);

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

    if (!request || !information) return <></>
    
    return (
        <>
        <Flex
            direction="column"
            flex={1}
            gap="size-100"
            position="relative"
        >
            <Flex marginBottom={"size-200"}>
                <Text UNSAFE_style={{ fontSize: '22px', color: 'green', fontWeight: 500}}>주문이 정상적으로 만료되었습니다.</Text>
            </Flex>
            <Flex gap={"size-500"}>
                <Flex direction={"column"} alignItems={'stretch'}>
                    <LabeledValue
                        label="주문번호"
                        value={request._id}
                        labelPosition="side"
                        UNSAFE_style={{textAlign:'right'}}
                        labelAlign="end"
                    />
                    <LabeledValue
                        label="배송지정보"
                        UNSAFE_style={{textAlign:'right'}}
                        value={`${request.shippingAddress} / ${request.phone} / ${request.phone1}`}
                        labelPosition="side"
                        labelAlign="start"
                    />
                    <LabeledValue
                        label="배송메모"
                        UNSAFE_style={{textAlign:'right'}}
                        value={request.shippingMemo}
                        labelPosition="side"
                        labelAlign="end"
                        
                    />
                    <LabeledValue
                        label="결제정보"
                        UNSAFE_style={{textAlign:'right'}}
                        value={''}
                        labelPosition="side"
                        labelAlign="end"
                        marginBottom={"size-500"}
                    />
                    <Flex direction={"column"} alignItems={'stretch'} marginStart={'size-400'}>
                        <LabeledValue
                            label="입금은행"
                            value={information.depositBank}
                            labelPosition="side"
                            UNSAFE_style={{textAlign:'right'}}
                            labelAlign="end"
                        />
                        <LabeledValue
                            label="예금주"
                            UNSAFE_style={{textAlign:'right'}}
                            value={information.accountHolder}
                            labelPosition="side"
                            labelAlign="start"
                        />
                        <LabeledValue
                            label="계좌번호"
                            UNSAFE_style={{textAlign:'right'}}
                            value={information.bankAccountNumber}
                            labelPosition="side"
                            labelAlign="end"
                            
                        />
                        <LabeledValue
                            label="입금기한"
                            UNSAFE_style={{textAlign:'right'}}
                            value={information.depositDeadline}
                            labelPosition="side"
                            labelAlign="end"
                        />
                    </Flex>
                </Flex>
                <Flex direction={"column"} alignItems={'stretch'} marginTop={'size-500'}>
                    <LabeledValue
                        label="상품금액"
                        value={request.product?.price}
                        labelPosition="side"
                        UNSAFE_style={{textAlign:'right'}}
                        labelAlign="end"
                    />
                    <LabeledValue
                        label="할인"
                        UNSAFE_style={{textAlign:'right'}}
                        value={information.discount.toString()}
                        labelPosition="side"
                        labelAlign="start"
                    />
                    <LabeledValue
                        label="배송비"
                        UNSAFE_style={{textAlign:'right'}}
                        value={information.deliveryFee.toString()}
                        labelPosition="side"
                        labelAlign="end"
                        
                    />
                    <LabeledValue
                        label="수수료"
                        UNSAFE_style={{textAlign:'right'}}
                        value={information.fee.toString()}
                        labelPosition="side"
                        labelAlign="end"
                    />

                    <LabeledValue
                        label="결제금액"
                        UNSAFE_style={{textAlign:'right'}}
                        value={request.product?.price}
                        labelPosition="side"
                        labelAlign="end"
                        marginTop={'size-500'}
                    />
                </Flex>
            </Flex>
            <Flex gap={"size-100"} marginTop={'size-200'} justifyContent={'center'}>
                <Button variant="accent" UNSAFE_style={{ borderRadius: '4px'}} style="fill" >쇼핑</Button>
            </Flex>
        </Flex>
        </>
    );
};
