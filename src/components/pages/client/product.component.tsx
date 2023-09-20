import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import { useRequestCreate } from "../../../api/requests/hooks/use-request-create.hook";
import ReactHtmlParser from "react-html-parser";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";

export const ProductComponent = ({device, ip}: {device: string | undefined, ip: string| undefined}): JSX.Element => {
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
    if (product && !htmlContent && device) {
      fetch(device === 'pc'? "/product.html": "/product.mobile.html") // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", product.name)
              .replaceAll("{my_goods_product_image}", product.image)
              .replaceAll("{my_goods_product_price}", new Intl.NumberFormat().format(product.price)),
          );
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [product, htmlContent, device]);

  useEffect(() => {
    if (ip && device && product && !connection) {

      createConnection({
        ip,
        device,
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

  }, [ip, device, product, connection]);

  useEffect(() => {
    if (connection) {
      setTimeout(() => {
        const btn = document.getElementById("btn_purchase");
        if (btn) {
          btn.addEventListener("click", () => {
            editConnection(connection._id, { page: "주문서작성" }).then(() => {
              navigate(PATHS.getProductConfirmUrl(productId));
            }).catch(
              (e) => {alert('오류발생')},
            );
          });
        }
      }, 1000);
    }
  }, [connection])

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

    
    return () => clearInterval(timer);
  }, []);

  if (!product) return <></>;

  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
