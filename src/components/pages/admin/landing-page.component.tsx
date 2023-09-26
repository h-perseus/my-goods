import { Header } from "../../shared/header";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../routes";
import { Flex, View } from "@adobe/react-spectrum";
import { ProductsComponent } from "./products/products.component";
import { ProductCreateComponent } from "./products/product-create.component";
import { RequestsComponent } from "./requests/requests.component";
import { RequestDetailComponent } from "./requests/request-detail.component";
import { InformationEditComponent } from "./information/information-edit.component";
import LandingPageSidebar from "./landing-page-sidebar.component";
import { UsersComponent } from "./users/users.component";
import { DomainsComponent } from "./domains/domains.component";
import { ConnectionsComponent } from "./connections/connections.component";
import { ProductEditComponent } from "./products/product-edit.component";
import { DomainCreateComponent } from "./domains/domain-create.component";
import { DomainEditComponent } from "./domains/domain-edit.component";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "../../../helpers/local-storage-keys";

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED)) {
      navigate("/login");
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          height:
            "var(--spectrum-global-dimension-size-700, var(--spectrum-alias-size-700))",
        }}
      >
        <Header />
      </div>
      <View
        backgroundColor="gray-50"
        paddingTop={"size-400"}
        overflow={
          /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )
            ? "auto"
            : "hidden"
        }
        UNSAFE_style={{
          flex: "1",
        }}
      >
        <Flex UNSAFE_style={{ height: "100%" }}>
          <View
            UNSAFE_style={{
              width: "140px",
              marginTop: "-32px",
              borderRight: "var(--spectrum-global-color-gray-200) solid 1px",
            }}
          >
            <LandingPageSidebar></LandingPageSidebar>
          </View>
          <Flex
            direction={"column"}
            maxHeight={"100%"}
            height={"100%"}
            position={"relative"}
            flex={1}
          >
            <Routes>
              <Route
                path={ROUTER_PATHS.PRODUCTS}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <ProductsComponent></ProductsComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.PRODUCT_CREATE}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <ProductCreateComponent></ProductCreateComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.PRODUCT_EDIT}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <ProductEditComponent></ProductEditComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.REQUESTS}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <RequestsComponent></RequestsComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.REQUEST}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <RequestDetailComponent></RequestDetailComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.DOMAINS}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <DomainsComponent></DomainsComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.DOMAIN_EDIT}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <DomainEditComponent></DomainEditComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.DOMAIN_CREATE}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <DomainCreateComponent></DomainCreateComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.CONNECTIONS}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <ConnectionsComponent></ConnectionsComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.USERS}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <UsersComponent></UsersComponent>
                  </Flex>
                }
              />
              <Route
                path={ROUTER_PATHS.INFORMATION}
                element={
                  <Flex
                    maxHeight={"100%"}
                    height={"100%"}
                    marginX={"size-800"}
                    direction={"column"}
                  >
                    <InformationEditComponent></InformationEditComponent>
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
