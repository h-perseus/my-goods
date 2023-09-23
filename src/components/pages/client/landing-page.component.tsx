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
                    <ProductComponent
                    ></ProductComponent>
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
                    <ProductConfirmComponent
                    ></ProductConfirmComponent>
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
                    <ProductLoginComponent
                    ></ProductLoginComponent>
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
                    <ProductRequestCreateComponent
                    ></ProductRequestCreateComponent>
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
                    <RequestFinishedComponent
                    ></RequestFinishedComponent>
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
