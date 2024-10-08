import { createContext } from "react";
import { ColorTheme } from "../data/themes";
import { MutableRefObject } from "react";

type FlatListRefContextType = {
    selectNewMonth: (newMonth: number) => void;
    selectNewYear: (newYear: number) => void;
    setCurrentMonth: (newMonth: number) => void;
    currentMonth: number;
    currentYear: number;
    sideMenuRef: React.MutableRefObject<undefined>;
    dropDownRef: React.MutableRefObject<{
        showDropdown: (year: number,
            month: number,
            day: number,
            data: string,
            setHasData: (data: string) => void,
            setColor: (color: string) => void,
            color: string) => void;
    }>;
    dayRef: React.MutableRefObject<undefined>;
    theme: ColorTheme;
    setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
};
const FlatListRefContext = createContext({} as FlatListRefContextType);

export default FlatListRefContext;
