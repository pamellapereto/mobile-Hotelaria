import { Dimensions } from "react-native";
import InputSpinner from "react-native-input-spinner";

type Props = {
  onSelectSpin: (guests: string) => void;
};

const InputSpin = ({ onSelectSpin }: Props) => {
  const { width, height } = Dimensions.get("window");

  return (
    <InputSpinner
      max={6}
      min={1}
      step={1}
      colorMax={"#420350ff"}
      colorMin={"#420350ff"}
      style={{
        width: width * 0.45,
      }}
    />
  );
};

export default InputSpin;
