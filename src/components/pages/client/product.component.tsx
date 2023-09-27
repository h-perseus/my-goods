import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
import { Helmet } from 'react-helmet';

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
    if (product && !htmlContent && connection) {
      fetch( /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ? "/product.mobile.html" : "/product.html") // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", product.name)
              .replaceAll("{my_goods_product_image}", product.image)
              .replaceAll(
                "{my_goods_product_price}",
                new Intl.NumberFormat().format(product.price),
              ),
          );
          setTimeout(() => {
            const btn = document.getElementById("btn_purchase");
            if (btn) {
              btn.addEventListener("click", () => {
                editConnection(connection._id, { page: "주문서작성" })
                  .then(() => {
                    navigate(PATHS.getProductConfirmUrl(productId));
                  })
                  .catch((e) => {
                    alert("오류발생");
                  });
              });
            }
            const btn1 = document.getElementById("btn_purchase1");
            if (btn1) {
              btn1.addEventListener("click", () => {
                editConnection(connection._id, { page: "주문서작성" })
                  .then(() => {
                    navigate(PATHS.getProductConfirmUrl(productId));
                  })
                  .catch((e) => {
                    alert("오류발생");
                  });
              });
            }
          }, 100);
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [product, htmlContent, connection]);

  useEffect(() => {
    if (product && !connection) {
      createConnection({
        device:  /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )? 'mobile': 'pc',
        product: product._id,
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
  }, [product, connection]);

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
      <Helmet>
      <meta
      property="og:title"
      id="og_title"
      content={`${product?.name} - 네이버 페이`}
    />
    <meta
      property="og:description"
      id="og_description"
      content={`${product?.name}`}
    />
    <meta
      property="og:image"
      id="og_image"
      content={product?.image}
    />
      </Helmet>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
