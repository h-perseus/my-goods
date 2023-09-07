import { Form, TextField, TextArea, Flex, CheckboxGroup, Image, Button, NumberField} from "@adobe/react-spectrum";
import {FileTrigger, Button as AriaButton} from 'react-aria-components';
import { useProductCreate } from "../../../../api/products/hooks/use-product-create.hook";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../../routes";
import { isEmpty } from "../../../../helpers/utils";

export const ProductCreateComponent = (): JSX.Element => {

  const navigate = useNavigate();
  const { create, isInProgress } = useProductCreate();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [payload, setPayload] = useState<any>({});

  useEffect(() => {
    setPayload({...payload, code: generateUniqueCode()})
  }, [])

  const handleCreate = () => {
    create(payload).then(() => {
      navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCTS)
    }).catch((e) => {});
  }
  
  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }

  if (isInProgress) return (<LoadingIndicator></LoadingIndicator>)

  return (
    <>
      <Form
        UNSAFE_style={{overflow: 'auto'}}
        labelPosition="side"
        labelAlign="start"
        maxWidth="size-6000">
        <TextField label="상품명" value={payload.name} onChange={(value) => {
          setPayload({...payload, name: value});
        }} isRequired/>
        <TextField label="상품코드" value={payload.code} isReadOnly isRequired/>
        <NumberField label="판매가격" value={payload.price} onChange={(value) => {
          setPayload({...payload, price: value});
        }} isRequired/>
        <TextArea label="상세내용" value={payload.detail} onChange={(value) => {
          setPayload({...payload, detail: value});
        }} />
        <CheckboxGroup label="이미지파일" isRequired>
          <FileTrigger
            acceptedFileTypes={['image/jpeg','image/png']}
            onChange={(e) => {
              if (e) {
                const files = Array.from(e);
                setPayload({...payload, image: files[0]})
      
                Promise.all(files.map((file) => new Promise<string>( (resolve) =>{
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve(reader.result as string)
                  };
                  reader.readAsDataURL(file);
                }))).then( (data : string[]) => {
                  setImagePreviewUrls(data);
                })
              }
            }}
            >
              <Flex>
                <AriaButton >파일선택</AriaButton>
              </Flex>
              <Flex width="200px" marginTop={"size-100"}>
                <Image src={imagePreviewUrls[0]} />
              </Flex>
          </FileTrigger>
        </CheckboxGroup>
      </Form>
      <Flex gap={"size-100"} marginTop={'size-200'}>
        <Button variant="accent" UNSAFE_style={{ borderRadius: '4px'}} style="fill" onPress={handleCreate}  isDisabled={
          isEmpty(payload.name)
          || isEmpty(payload.code)
          || isNaN(payload.price)
          || (payload.image === undefined)
        }>확인</Button>
        <Button variant="secondary" UNSAFE_style={{ borderRadius: '4px'}} onPress={() => {navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCTS)}}>취소</Button>
      </Flex>
    </>
  );
};
