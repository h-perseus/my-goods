import { Link, useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../routes";
import { Flex, Heading, ActionButton } from "@adobe/react-spectrum";
import classes from "./header.module.scss";
import { removeLocalStorageKey } from "../../../helpers/utils";
import { LOCAL_STORAGE_KEYS } from "../../../helpers/local-storage-keys";

export const LandingPageHeader = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
      <Flex
        UNSAFE_style={{ backgroundColor: "#005b85", color: "white" }}
        justifyContent={"space-between"}
        height={"100%"}
        alignItems={"center"}
      >
        <Flex height={"100%"}>
          <Link
            to={ROUTER_PATHS.LANDING_PAGE}
            className={classes.headerLogoLink}
          >
            <Heading
              level={3}
              marginStart={"size-200"}
              marginY={"auto"}
              id={"application-title"}
              UNSAFE_style={{ color: "white" }}
            >
              괸리자모드
            </Heading>
          </Link>
        </Flex>
        <ActionButton isQuiet staticColor="white" onPress={() => {
          removeLocalStorageKey(LOCAL_STORAGE_KEYS.AUTHORIZED);
          navigate("/login");
        }}>로그아웃</ActionButton>
      </Flex>
    </>
  );
};
