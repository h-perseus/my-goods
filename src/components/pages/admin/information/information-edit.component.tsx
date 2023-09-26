import {
  Form,
  TextField,
  Flex,
  Button,
  Picker,
  Item,
} from "@adobe/react-spectrum";
import { useInformation } from "../../../../api/information/hooks/use-information.hook";
import { useDomains } from "../../../../api/domains/hooks/use-domains.hook";
import { useEffect, useState } from "react";
import { isEmpty } from "../../../../helpers/utils";
import { useInformationEdit } from "../../../../api/information/hooks/use-information-edit.hook";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";

export const InformationEditComponent = (): JSX.Element => {
  const { information } = useInformation();
  const { domains } = useDomains({ searchOptions: undefined });
  const [payload, setPayload] = useState<any>({});
  const { edit, isInProgress } = useInformationEdit();
  const { load } = useInformation();

  useEffect(() => {
    if (information) {
      setPayload({
        ...payload,
        ...information,
        domain: information.domain?._id,
      });
    }
  }, [information]);

  const handleEdit = () => {
    edit(payload)
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  if (!information || !domains) return <></>;
  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;

  return (
    <>
      <Form
        UNSAFE_style={{ overflow: "auto" }}
        labelPosition="side"
        labelAlign="start"
        maxWidth="size-6000"
      >
        <Picker
          label="도메인"
          items={domains}
          selectedKey={payload.domain}
          onSelectionChange={(value) => {
            setPayload({ ...payload, domain: value });
          }}
        >
          {(item: any) => <Item key={item._id}>{item.value}</Item>}
        </Picker>
        {/* <TextField
          label="아이디"
          value={payload.userId}
          onChange={(value) => {
            setPayload({ ...payload, userId: value });
          }}
        />
        <TextField
          label="비밀번호"
          value={payload.password}
          onChange={(value) => {
            setPayload({ ...payload, password: value });
          }}
        /> */}
        <TextField
          label="할인"
          value={payload.discount}
          onChange={(value) => {
            setPayload({ ...payload, discount: value });
          }}
        />
        <TextField
          label="수수료"
          value={payload.fee}
          onChange={(value) => {
            setPayload({ ...payload, fee: value });
          }}
        />
        <TextField
          label="배송비"
          value={payload.deliveryFee}
          onChange={(value) => {
            setPayload({ ...payload, deliveryFee: value });
          }}
        />
        <TextField
          label="판매자아이디"
          value={payload.seller}
          onChange={(value) => {
            setPayload({ ...payload, seller: value });
          }}
        />
        <TextField
          label="입금은행"
          value={payload.depositBank}
          onChange={(value) => {
            setPayload({ ...payload, depositBank: value });
          }}
        />
        <TextField
          label="입금기한"
          value={payload.depositDeadline}
          onChange={(value) => {
            setPayload({ ...payload, depositDeadline: value });
          }}
        />
        <TextField
          label="계좌번호"
          value={payload.bankAccountNumber}
          onChange={(value) => {
            setPayload({ ...payload, bankAccountNumber: value });
          }}
        />
        <TextField
          label="예금주"
          value={payload.accountHolder}
          onChange={(value) => {
            setPayload({ ...payload, accountHolder: value });
          }}
        />
      </Form>
      <Flex gap={"size-100"} marginTop={"size-200"}>
        <Button
          variant="accent"
          UNSAFE_style={{ borderRadius: "4px" }}
          style="fill"
          onPress={handleEdit}
          // isDisabled={isEmpty(payload.userId) || isEmpty(payload.password)}
        >
          확인
        </Button>
      </Flex>
    </>
  );
};
