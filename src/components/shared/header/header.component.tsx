import { Link } from "react-router-dom";
import { ROUTER_PATHS } from "../../../routes";
import { Flex, Heading } from "@adobe/react-spectrum";
import classes from "./header.module.scss";

export const LandingPageHeader = ({
  grayscale = false,
}: {
  grayscale?: boolean;
}): JSX.Element => {
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
      </Flex>
    </>
  );
};
