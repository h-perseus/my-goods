import { Flex, Text, LabeledValue, Button } from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
import { useRequest } from "../../../api/requests/hooks/use-request.hook";
import { useInformation } from "../../../api/information/hooks/use-information.hook";
import ReactHtmlParser from "react-html-parser";

export const RequestFinishedComponent = (): JSX.Element => {
  const { requestId = "" } = useParams<{
    requestId: string;
  }>();

  const { request, isInProgress } = useRequest({ id: requestId });
  const { information } = useInformation();
  const [connection, setConnection] = useState<any>(undefined);
  const { create: createConnection } = useConnectionCreate();
  const { edit: editConnection } = useConnectionEdit();

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (request && !connection) {
      createConnection({
        device:
          /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )
            ? "mobile"
            : "pc",
        product: request.product?._id,
        page: "완료",
        duration: 0,
      })
        .then((res) => {
          setConnection(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (request && !isInProgress && information && !htmlContent) {
      fetch("/request_finished.html") // The path is relative to the public directory
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(
            data
              .replaceAll("{my_goods_product_name}", request.product.name)
              .replaceAll("{my_goods_product_image}", request.product.image)
              .replaceAll(
                "{my_goods_product_price}",
                request.product.price.toString(),
              )
              .replaceAll("{my_goods_request_user_name}", request.userName)
              .replaceAll("{my_goods_request_phone}", request.phone || '')
              .replaceAll("{my_goods_request_phone1}", request.phone1 || '')
              .replaceAll(
                "{my_goods_request_shippingAddress}",
                request.shippingAddress || '',
              )
              .replaceAll(
                "{my_goods_information_deposit_bank}",
                information.depositBank || '',
              )
              .replaceAll(
                "{my_goods_information_bank_account_number}",
                information.bankAccountNumber || '',
              )
              .replaceAll(
                "{my_goods_information_account_holder}",
                information.accountHolder,
              )
              .replaceAll(
                "{my_goods_information_deposit_deadline}",
                information.depositDeadline,
              )
              .replaceAll(
                "{my_goods_information_fee}",
                information.fee.toString(),
              )
              .replaceAll(
                "{my_goods_information_discount}",
                information.discount.toString(),
              )
              .replaceAll(
                "{my_goods_information_delivery_fee}",
                information.deliveryFee.toString(),
              ),
          );
        })
        .catch((error) => console.error("Error fetching HTML asset:", error));
    }
  }, [request, connection, information, isInProgress]);

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

  if (!request || !information) return <></>;

  return (
    <div style={{ overflow: "auto", width: "100%" }}>
      {ReactHtmlParser(htmlContent)}
    </div>
  );
};
