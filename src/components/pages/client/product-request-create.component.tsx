import { useCallback, useEffect, useState } from "react";
import { useInformation } from "../../../api/information/hooks/use-information.hook";
import { useRequest } from "../../../api/requests/hooks/use-request.hook";
import { useNavigate, useParams } from "react-router-dom";
import { useRequestEdit } from "../../../api/requests/hooks/use-request-edit.hook";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { isEmpty } from "../../../helpers/utils";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
import ReactHtmlParser from "react-html-parser";

export const ProductRequestCreateComponent = ({
  device,
  ip,
}: {
  device: string | undefined;
  ip: string | undefined;
}): JSX.Element => {
  const navigate = useNavigate();
  const { requestId = "" } = useParams<{
    requestId: string;
  }>();

  const { information } = useInformation();
  const { request } = useRequest({ id: requestId });
  const { edit: editRequest, isInProgress } = useRequestEdit();
  const { create: createConnection } = useConnectionCreate();
  const { edit: editConnection } = useConnectionEdit();
  const [connection, setConnection] = useState<any>(undefined);

  const handlePay = (connectionId: string) => {
    let payload: any = {};

    const phone01: any = document.getElementById("dd_sh_hp1");
    const phone02: any = document.getElementById("dd_sh_hp2");
    const phone03: any = document.getElementById("dd_sh_hp3");
    if (phone01 && phone02 && phone03) {
      if (!isEmpty(phone02.value) && !isEmpty(phone03.value)) {
        payload.phone = `${phone01.value}-${phone02.value}-${phone03.value}`;
      }
    }

    const phone11: any = document.getElementById("dd_hp1");
    const phone12: any = document.getElementById("dd_hp2");
    const phone13: any = document.getElementById("dd_hp3");
    if (phone11 && phone12 && phone13) {
      payload.phone1 = `${phone11.value}-${
        isEmpty(phone12.value) ? "0000" : phone12.value
      }-${isEmpty(phone13.value) ? "0000" : phone13.value}`;
    }

    const userName: any = document.getElementById("dd_sh_xingming");
    if (userName) {
      payload.userName = userName.value;
    }
    const shippingAddress: any = document.getElementById("dd_sh_dizhi1");
    if (shippingAddress) {
      payload.shippingAddress = shippingAddress.value;
    }
    const shippingMemo: any = document.getElementById("dd_memo");
    if (shippingMemo) {
      payload.shippingMemo = shippingMemo.value;
    }
    if (isEmpty(payload.userName)) {
      alert("이름을 입력하세요");
      return;
    }
    if (isEmpty(payload.phone) && isEmpty(payload.phone1)) {
      alert("연락처를 입력하세요");
      return;
    }
    if (request) {
      editRequest(requestId, payload)
        .then(async () => {
          await editConnection(connectionId, { page: "완료" });
          navigate(PATHS.getRequestFinishedUrl(requestId));
        })
        .catch((e) => {});
    }
  };

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (information && request && connection && device && !htmlContent) {
      fetch(device === "pc" ? "/request.html" : "/request.mobile.html") // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", request.product.name)
              .replaceAll("{my_goods_product_image}", request.product.image)
              .replaceAll("{my_goods_information_seller}", information.seller)
              .replaceAll(
                "{my_goods_information_delivery_fee}",
                new Intl.NumberFormat().format(information.deliveryFee),
              )
              .replaceAll(
                "{my_goods_information_fee}",
                new Intl.NumberFormat().format(information.fee),
              )
              .replaceAll(
                "{my_goods_product_price}",
                new Intl.NumberFormat().format(request.product.price),
              ),
          );
          setTimeout(() => {
            const submit = document.getElementById("my_goods_submit");
            if (submit) {
              submit.addEventListener("click", () => {
                handlePay(connection._id);
              });
            }
          }, 100);
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [information, request, htmlContent, connection, device]);

  useEffect(() => {
    if (ip && device && request && !connection) {
      createConnection({
        device,
        product: request.product?._id,
        page: "주문서작성",
        ip,
      })
        .then((res) => {
          setConnection(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [ip, device, request, connection]);

  useEffect(() => {
    const timer = setInterval(() => {
      setConnection((prev: any) => {
        if (prev) {
          try {
            editConnection(prev._id, {
              duration: prev.duration + 1,
              page: "주문서작성",
            }).catch((e) => {});
          } catch (error) {}
          return { ...prev, duration: prev.duration + 1 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!request || !information) return <></>;
  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;

  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
    // <>
    //   <TableView width="100%" overflowMode="wrap" density={tableDensity}>
    //     <TableHeader columns={columns}>
    //       {(column) => <Column width={column.width}>{column.name}</Column>}
    //     </TableHeader>
    //     <TableBody items={tableItems}>
    //       {(item) => (
    //         <Row key={item.id}>
    //           {(key) => {
    //             if (key === "image") {
    //               return (
    //                 <Cell>
    //                   <Image src={item[key]} />
    //                 </Cell>
    //               );
    //             } else {
    //               return <Cell>{item[key]}</Cell>;
    //             }
    //           }}
    //         </Row>
    //       )}
    //     </TableBody>
    //   </TableView>
    //   <Flex gap={"size-200"} alignItems={"end"} marginTop={"size-200"}>
    //     <View>
    //       <Heading level={4}>배송지정보</Heading>
    //       <Form
    //         UNSAFE_style={{ overflow: "auto" }}
    //         labelPosition="side"
    //         labelAlign="start"
    //         maxWidth="size-6000"
    //       >
    //         <TextField
    //           label="수령인"
    //           value={payload.userName}
    //           onChange={(value) => {
    //             setPayload({ ...payload, userName: value });
    //           }}
    //           isRequired
    //         />
    //         <TextField
    //           label="연락처1"
    //           value={payload.phone}
    //           onChange={(value) => {
    //             setPayload({ ...payload, phone: value });
    //           }}
    //           isRequired
    //         />
    //         <TextField
    //           label="연락처2"
    //           value={payload.phone1}
    //           onChange={(value) => {
    //             setPayload({ ...payload, phone1: value });
    //           }}
    //           isRequired
    //         />
    //         <TextField
    //           label="배송지주소"
    //           value={payload.shippingAddress}
    //           onChange={(value) => {
    //             setPayload({ ...payload, shippingAddress: value });
    //           }}
    //           isRequired
    //         />
    //         <TextField
    //           label="배송메모"
    //           value={payload.shippingMemo}
    //           onChange={(value) => {
    //             setPayload({ ...payload, shippingMemo: value });
    //           }}
    //         />
    //       </Form>
    //     </View>
    //     <Divider orientation={"vertical"} size="S" />
    //     <Flex direction={"column"} alignItems={"stretch"}>
    //       <LabeledValue
    //         label="상품금액"
    //         value={request.product?.price}
    //         labelPosition="side"
    //         UNSAFE_style={{ textAlign: "right" }}
    //         labelAlign="end"
    //       />
    //       <LabeledValue
    //         label="할인"
    //         UNSAFE_style={{ textAlign: "right" }}
    //         value={information.discount.toString()}
    //         labelPosition="side"
    //         labelAlign="start"
    //       />
    //       <LabeledValue
    //         label="배송비"
    //         UNSAFE_style={{ textAlign: "right" }}
    //         value={information.deliveryFee.toString()}
    //         labelPosition="side"
    //         labelAlign="end"
    //       />
    //       <LabeledValue
    //         label="수수료"
    //         UNSAFE_style={{ textAlign: "right" }}
    //         value={information.fee.toString()}
    //         labelPosition="side"
    //         labelAlign="end"
    //       />
    //     </Flex>
    //   </Flex>
    //   <Flex gap={"size-100"} marginTop={"size-200"}>
    //     <Button
    //       variant="accent"
    //       UNSAFE_style={{ borderRadius: "4px" }}
    //       style="fill"
    //       onPress={handlePay}
    //       isDisabled={
    //         isEmpty(payload.userName) ||
    //         isEmpty(payload.phone) ||
    //         isEmpty(payload.phone1) ||
    //         isEmpty(payload.shippingAddress)
    //       }
    //     >
    //       확인
    //     </Button>
    //   </Flex>
    // </>
  );
};
