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

export const ProductComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { productId = "" } = useParams<{
    productId: string;
  }>();

  const [connection, setConnection] = useState<any>(undefined);

  const { product } = useProduct({ id: productId });
  const { create: createConnection } = useConnectionCreate();
  const { edit: editConnection } = useConnectionEdit();

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (product && !connection) {
      createConnection({
        device:
          /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )
            ? "mobile"
            : "pc",
        product: productId,
        page: "메인",
        duration: 0,
      })
        .then((res) => {
          setConnection(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (product && !htmlContent) {
      fetch("/product.html") // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", product.name)
              .replaceAll("{my_goods_product_image}", product.image)
              .replaceAll("{my_goods_product_price}", product.price.toString()),
          );
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [product, connection, htmlContent]);

  useEffect(() => {
    const timer = setInterval(() => {
      setConnection((prev: any) => {
        if (prev) {
          try {
            editConnection(prev._id, { duration: prev.duration + 1 }).catch(
              (e) => {},
            );
          } catch (error) {}
          return { ...prev, duration: prev.duration + 1 };
        }
        return prev;
      });
    }, 1000);

    setTimeout(() => {
      const btn = document.getElementById("btn_purchase");
      if (btn) {
        btn.addEventListener("click", () => {
          navigate(PATHS.getProductConfirmUrl(productId));
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) return <></>;

  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
