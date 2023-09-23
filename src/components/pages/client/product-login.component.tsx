import { useNavigate, useParams } from "react-router-dom";
import { useRequestCreate } from "../../../api/requests/hooks/use-request-create.hook";
import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { PATHS } from "../../../routes";

export const ProductLoginComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { productId = "" } = useParams<{
    productId: string;
  }>();

  const { create: createRequest, isInProgress } = useRequestCreate();

  const handleCreate = () => {
    const userIdEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    if (userIdEl && passwordEl) {
      createRequest({
        userId: (userIdEl as any).value,
        password: (passwordEl as any).value,
        productId: productId,
      })
        .then((res) => {
          navigate(PATHS.getRequestUrl(res._id));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (!htmlContent) {
      fetch(
        /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) ? "/product_login.mobile.html" : "/product_login.html",
      ) // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(data);
          setTimeout(() => {
            const btn = document.getElementById("btn_login");
            if (btn) {
              btn.addEventListener("click", () => {
                handleCreate();
              });
            }
          }, 100);
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [htmlContent]);

  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;
  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
