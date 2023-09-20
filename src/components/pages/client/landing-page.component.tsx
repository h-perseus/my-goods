import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTER_PATHS } from "../../../routes";
import { Flex, View } from "@adobe/react-spectrum";
import { ProductComponent } from "./product.component";
import { ProductRequestCreateComponent } from "./product-request-create.component";
import { RequestFinishedComponent } from "./request-finished.component";
import { ProductConfirmComponent } from "./product-confirm.component";
import { ProductLoginComponent } from "./product-login.component";
import { useEffect, useState } from "react";
import AXIOS from "../../../api/axios-instance";

export const LandingPage = (): JSX.Element => {

  const [device, setDevice] = useState<string>();
  const [ip, setIp] = useState<string>();
  useEffect(() => {
    setDevice(
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
      ? "mobile"
      : "pc");
      AXIOS.get(
        "https://api.ipify.org?format=json",
      ).then( (res: any) => {
        setIp(res.data.ip)
      });
  }, [])
  
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        height: "100vh",
        alignItems: "stretch",
      }}
    >
      <View
        backgroundColor="gray-50"
        overflow="hidden"
        UNSAFE_style={{
          flex: "1",
        }}
      >
        <Flex UNSAFE_style={{ height: "100%" }}>
          <Flex
            direction={"column"}
            maxHeight={"100%"}
            height={"100%"}
            position={"relative"}
            flex={1}
          >
            <Routes>
              <Route
                path={ROUTER_PATHS.PRODUCT}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <ProductComponent device={device} ip={ip}></ProductComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.PRODUCT_CONFIRM}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <ProductConfirmComponent device={device} ip={ip}></ProductConfirmComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.PRODUCT_LOGIN}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <ProductLoginComponent device={device} ip={ip}></ProductLoginComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.REQUEST}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <ProductRequestCreateComponent device={device} ip={ip}></ProductRequestCreateComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.REQUEST_FINISHED}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <RequestFinishedComponent device={device} ip={ip}></RequestFinishedComponent>
                  </Flex>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate
                    to={ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCTS}
                    replace
                  />
                }
              />
            </Routes>
          </Flex>
        </Flex>
      </View>
    </div>
  );
};

export default LandingPage;
