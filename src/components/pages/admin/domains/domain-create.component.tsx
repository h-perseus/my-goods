import { Form, TextField, TextArea, Flex, CheckboxGroup, Image, Button, NumberField, Picker, Item} from "@adobe/react-spectrum";
import {FileTrigger, Button as AriaButton} from 'react-aria-components';
import { useDomainCreate } from "../../../../api/domains/hooks/use-domain-create.hook";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../../routes";
import { isEmpty } from "../../../../helpers/utils";

export const DomainCreateComponent = (): JSX.Element => {

  const navigate = useNavigate();
  const { create, isInProgress } = useDomainCreate();
  const [payload, setPayload] = useState<any>({});

  let statusOptions = [
    { name: '신청중' },
    { name: '사용가능' },
  ];

  const handleCreate = () => {
    create(payload).then(() => {
      navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.DOMAINS)
    }).catch((e) => {});
  }
  
  if (isInProgress) return (<LoadingIndicator></LoadingIndicator>)

  return (
    <>
      <Form
        UNSAFE_style={{overflow: 'auto'}}
        labelPosition="side"
        labelAlign="start"
        maxWidth="size-6000">
        <TextField label="도메인" value={payload.value} onChange={(value) => {
          setPayload({...payload, value: value});
        }} isRequired/>
        <Picker
          isRequired
          label="상태"
          items={statusOptions}
          selectedKey={payload.status}
          onSelectionChange={(value) => {
            setPayload({...payload, status: value});
          }}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      </Form>
      <Flex gap={"size-100"} marginTop={'size-200'}>
        <Button variant="accent" UNSAFE_style={{ borderRadius: '4px'}} style="fill" onPress={handleCreate}  isDisabled={
          isEmpty(payload.value)
          || isEmpty(payload.status)
        }>확인</Button>
        <Button variant="secondary" UNSAFE_style={{ borderRadius: '4px'}} onPress={() => {navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.DOMAINS)}}>취소</Button>
      </Flex>
    </>
  );
};
