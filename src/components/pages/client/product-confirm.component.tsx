import {
  Flex,
  Text,
  Image,
  Form,
  TextField,
  DialogTrigger,
  View,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button,
} from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import { useRequestCreate } from "../../../api/requests/hooks/use-request-create.hook";
import ReactHtmlParser from "react-html-parser";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";

export const ProductConfirmComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { productId = "" } = useParams<{
    productId: string;
  }>();

  const [user, setUser] = useState<any>({ userId: "", password: "" });
  const [connection, setConnection] = useState<any>(undefined);

  const { product } = useProduct({ id: productId });
  const { create: createConnection } = useConnectionCreate();
  const { edit: editConnection } = useConnectionEdit();
  const { create: createRequest, isInProgress } = useRequestCreate();

  const handleCreate = useCallback(() => {
    createRequest({ ...user, productId: productId })
      .then((res) => {
        navigate(PATHS.getRequestUrl(res._id));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  if (!product) return <></>;
  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;

  return (
    <div className="q1_wr">
      <div className="q1_jz">
        <div className="q1_nr">
          <div className="q1_nr_01">구매하기</div>
          <div className="q1_nr_02">
            <div className="q1_nr_0201">
              {product.name} (1개)를 구매하시겠습니까?
            </div>
            <div className="q1_nr_0202">
              구매가격 : <span style={{ color: "red" }}>{product.price}원</span>
            </div>
          </div>
          <div className="q1_nr_03">
            <button
              type="button"
              className="q1_btn_01"
              onClick={() => {
                navigate(PATHS.getProductLoginUrl(productId));
              }}
            >
              예
            </button>
            <button
              type="button"
              className="q1_btn_02"
              onClick={() => {
                navigate(PATHS.getProductUrl(productId));
              }}
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
