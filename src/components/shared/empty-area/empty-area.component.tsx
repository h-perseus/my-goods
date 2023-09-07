import { Image, Text, Flex, ActionButton, Well } from "@adobe/react-spectrum";
import { View } from "@react-spectrum/view";

import Placeholder from "../../../assets/shallow_cnn.png";
import classes from "./empty-area.module.scss";

export const EmptyArea = (): JSX.Element => {
  const TITLE = "Create your first item";
  const DESCRIPTION = "Create a new project for activity recognition.";
  const callbacks: any = {};

  const onPressNewProject = () => {
    if (callbacks && callbacks.handleOpenDialog) {
      callbacks.handleOpenDialog();
    }
  };

  return (
    <Well height={"size-4000"} margin={0} id="no-project-area">
      <Flex direction={"row"} height={"100%"}>
        <Image
          src={Placeholder}
          alt={""}
          minHeight={"100%"}
          margin={"size-100"}
          objectFit={"cover"}
        />
        <Flex
          direction={"column"}
          marginStart={"size-500"}
          marginEnd={"size-700"}
          justifyContent={"space-between"}
        >
          <View UNSAFE_className={classes.description}>
            <h3 id={"no-projects-area-title"}>{TITLE}</h3>
            <Text id={"no-projects-area-description"}>{DESCRIPTION}</Text>
          </View>
          <View marginBottom={"size-300"}>
            <ActionButton onPress={onPressNewProject}>
              <Text>Create new project</Text>
            </ActionButton>
          </View>
        </Flex>
      </Flex>
    </Well>
  );
};
