import { createContext } from "react";
import { ColorTheme } from "../data/themes";
type FlatListRefContextType = {
    selectNewMonth: (newMonth: number) => void;
    selectNewYear: (newYear: number) => void;
    setCurrentMonth: (newMonth: number) => void;
    currentMonth: number;
    currentYear: number;
    sideMenuRef: React.MutableRefObject<undefined>;
    dropDownRef: React.MutableRefObject<undefined>;
    dayRef: React.MutableRefObject<undefined>;
    theme: ColorTheme;
    setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
};
const FlatListRefContext = createContext({} as FlatListRefContextType);

export default FlatListRefContext;
