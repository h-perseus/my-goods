import { Form, TextField, Flex, Button } from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "../../../../api/requests/hooks/use-request.hook";
import { ROUTER_PATHS } from "../../../../routes";

export const RequestDetailComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { requestId = "" } = useParams<{
    requestId: string;
  }>();

  const { request } = useRequest({ id: requestId });

  if (!request) return <></>;

  return (
    <>
      <Form
        UNSAFE_style={{ overflow: "auto" }}
        labelPosition="side"
        labelAlign="start"
        maxWidth="size-6000"
      >
        <TextField label="상품명" value={request.product?.name} isReadOnly />
        <TextField label="아이디" value={request.user?.userId} isReadOnly />
        <TextField label="비밀번호" value={request.user?.password} isReadOnly />
        <TextField label="수취인이름" value={request.userName} isReadOnly />
        <TextField
          label="배송지주소"
          value={request.shippingAddress}
          isReadOnly
        />
        <TextField label="배송메모" value={request.shippingMemo} isReadOnly />
        <TextField label="수취인연락처" value={request.phone} isReadOnly />
        <TextField label="수취인연락처1" value={request.phone1} isReadOnly />
      </Form>
      <Flex gap={"size-100"} marginTop={"size-200"}>
        <Button
          variant="secondary"
          UNSAFE_style={{ borderRadius: "4px" }}
          onPress={() => {
            navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.REQUESTS);
          }}
        >
          목록보기
        </Button>
      </Flex>
    </>
  );
};
