import { Form, TextField, Flex, Button, Heading, useAsyncList, Image, TableHeader, Column, TableBody, Row, Cell, TableView, View, LabeledValue, Divider} from "@adobe/react-spectrum";
import { useEffect, useState } from "react";
import { useInformation } from "../../../api/information/hooks/use-information.hook";
import { useRequest } from "../../../api/requests/hooks/use-request.hook";
import { useNavigate, useParams } from "react-router-dom";
import { useRequestEdit } from "../../../api/requests/hooks/use-request-edit.hook";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { isEmpty } from "../../../helpers/utils";
import { PATHS, ROUTER_PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
let columns = [
  { name: "", key: "image", width: 150 },
  { name: "상품정보", key: "name" },
  { name: "판매자", key: "seller", width: 200 },
  { name: "수수료", key: "fee", width: 100 },
  { name: "수량", key: "quantity", width: 100 },
  { name: "할인", key: "discount", width: 100 },
  { name: "주문금액", key: "price", width: 100 }
];

export const ProductRequestCreateComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { requestId = '' } = useParams<{
    requestId: string;
  }>();

  const { information} = useInformation();
  const { request} = useRequest({id: requestId});
  const { edit: editRequest, isInProgress} = useRequestEdit();
  const { create: createConnection} = useConnectionCreate();
  const { edit: editConnection} = useConnectionEdit();
  const [connection, setConnection] = useState<any>(undefined);


  let [tableDensity, setTableDensity] = useState<any>("compact");
  const [tableItems, setTableItems ] = useState<any[]>([]);

  const [payload, setPayload] = useState<any>({});

  const handlePay = () => {
    if (request) {
      editRequest(requestId, payload).then(() => {
        navigate(PATHS.getRequestFinishedUrl(requestId))
      }).catch((e) => {});
    }
  }

  
  useEffect(() => {
    setTimeout(() => {
      setTableDensity("spacious");
    }, 1000);
  });

  useEffect(() => { 
    if (information && request) {
      setTableItems([
        {
          id: '1',
          image: request.product?.image,
          name: request.product?.name,
          seller: information.seller,
          fee: information.fee,
          quantity: 1,
          discount: information.discount,
          price: request.product?.price
        }
      ])
    }
  }, [information, request])

  
  useEffect(() => {
      if (request && !connection) {
          createConnection({
              device: /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile': 'pc',
              product: request.product?._id,
              page: '주문서작성',
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
    if (isInProgress) return <LoadingIndicator></LoadingIndicator>


  return (
    <>
      <TableView
      width="100%"
      overflowMode="wrap"
      density={tableDensity}
      >
      <TableHeader columns={columns}>
          {(column) => (
          <Column
              width={column.width}
          >
              {column.name}
          </Column>
          )}
      </TableHeader>
      <TableBody items={tableItems}>
          {(item) => (
          <Row key={item.id}>
              {(key) => {
              if (key === "image") {
                  return (
                  <Cell>
                      <Image src={item[key]} />
                  </Cell>
                  );
              } else {
                  return <Cell>{item[key]}</Cell>;
              }
              }}
          </Row>
          )}
      </TableBody>
      </TableView>
      <Flex gap={"size-200"} alignItems={'end'} marginTop={"size-200"}>
        <View>
          <Heading level={4}>배송지정보</Heading>
          <Form
            UNSAFE_style={{overflow: 'auto'}}
            labelPosition="side"
            labelAlign="start"
            maxWidth="size-6000">
            <TextField label="수령인" value={payload.userName} onChange={(value) => {
          setPayload({...payload, userName: value});
        }} isRequired />
            <TextField label="연락처1" value={payload.phone} onChange={(value) => {
          setPayload({...payload, phone: value});
        }} isRequired/>
            <TextField label="연락처2" value={payload.phone1} onChange={(value) => {
          setPayload({...payload, phone1: value});
        }} isRequired/>
            <TextField label="배송지주소" value={payload.shippingAddress} onChange={(value) => {
          setPayload({...payload, shippingAddress: value});
        }} isRequired />
            <TextField label="배송메모" value={payload.shippingMemo} onChange={(value) => {
          setPayload({...payload, shippingMemo: value});
        }} />
          </Form>
        </View>
        <Divider orientation={'vertical'} size="S"/>
        <Flex direction={"column"} alignItems={'stretch'}>
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
        </Flex>
      </Flex>
      <Flex gap={"size-100"} marginTop={'size-200'}>
        <Button variant="accent" UNSAFE_style={{ borderRadius: '4px'}} style="fill" onPress={handlePay}  isDisabled={
            isEmpty(payload.userName)
            || isEmpty(payload.phone)
            || isEmpty(payload.phone1)
            || isEmpty(payload.shippingAddress)
          }>확인</Button>
      </Flex>
    </>
  );
};
