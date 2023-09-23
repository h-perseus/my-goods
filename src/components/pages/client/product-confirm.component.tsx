import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import { useEffect, useState } from "react";
import { PATHS } from "../../../routes";
import ReactHtmlParser from "react-html-parser";

export const ProductConfirmComponent = (
  ): JSX.Element => {
  const navigate = useNavigate();
  const { productId = "" } = useParams<{
    productId: string;
  }>();

  const { product } = useProduct({ id: productId });

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (product && !htmlContent) {
      fetch(
        /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
          ? "/product_confirm.mobile.html"
          : "/product_confirm.html",
      ) // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", product.name)
              .replaceAll(
                "{my_goods_product_price}",
                new Intl.NumberFormat().format(product.price),
              ),
          );
          setTimeout(() => {
            const btn = document.getElementById("btn_confirm");
            if (btn) {
              btn.addEventListener("click", () => {
                navigate(PATHS.getProductLoginUrl(productId));
              });
            }
            const btnCancel = document.getElementById("btn_cancel");
            if (btnCancel) {
              btnCancel.addEventListener("click", () => {
                navigate(PATHS.getProductUrl(productId));
              });
            }
          }, 100);
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [product, htmlContent]);

  if (!product) return <></>;

  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
