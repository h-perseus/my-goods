import { Flex, ProgressCircle } from "@adobe/react-spectrum";
import { SpectrumProgressCircleProps } from "@react-types/progress";

export const LoadingIndicator = (
  props: SpectrumProgressCircleProps,
): JSX.Element => {
  const { size = "L", ...rest } = props;

  return (
    <Flex alignItems={"center"} justifyContent={"center"} height="100%">
      <ProgressCircle
        aria-label="Loading..."
        isIndeterminate
        size={size}
        {...rest}
      />
    </Flex>
  );
};
