import { ReactNode } from "react";

import { IllustratedMessage, View } from "@adobe/react-spectrum";

import classes from "./error-layout.module.scss";

interface ErrorLayoutProps {
  children: ReactNode;
}

export const ErrorLayout = ({ children }: ErrorLayoutProps): JSX.Element => {
  return (
    <View UNSAFE_className={classes.errorContainer} height={"100vh"}>
      <View backgroundColor={"gray-50"} width={"90%"} height={"60%"}>
        <View position={"relative"}>
          <View
            width={"size-200"}
            height={"size-200"}
            backgroundColor={"gray-300"}
          />
          <View
            position={"absolute"}
            top={"size-200"}
            left={"size-200"}
            width={"size-100"}
            height={"size-100"}
            backgroundColor={"gray-300"}
          />
        </View>
        <IllustratedMessage height={"80%"}>{children}</IllustratedMessage>
      </View>
    </View>
  );
};
