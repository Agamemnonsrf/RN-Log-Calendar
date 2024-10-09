export type ColorTheme = {
    name: string;
    overall: string;
    background: string;
    backgroundGradient: string[];
    primary: string;
    antithesis: string;
    primaryLowFade: string;
    primaryMidFade: string;
    primaryHighFade: string;
    primaryVeryHighFade: string;
    secondary: string;
    secondaryVibrant?: string;
    tertiary: string;
    quaternary: string;
    quinary06opacity?: string;
    quinary1opacity?: string;
};

const colorThemes: { [key: string]: ColorTheme }
    = {
    defaultLight: {
        name: "defaultLight",
        overall: "light",
        background: "#fafafa",
        backgroundGradient: ["#414857", "#2B303A"],
        primary: "white",
        antithesis: "white",
        primaryLowFade: "rgba(72,75,106,0.9)",
        primaryMidFade: "rgba(72,75,106,0.7)",
        primaryHighFade: "rgba(72,75,106,0.5)",
        primaryVeryHighFade: "rgba(72,75,106,0.2)",
        secondary: "#e4e5f1",
        secondaryVibrant: "#e4e5f1",
        tertiary: "#d2d3db",
        quaternary: "#9394a5",
    },
    defaultDark: {
        name: "defaultDark",
        overall: "dark",
        background: "#2B303A",
        backgroundGradient: ["#1A1A1A", "black"],
        primary: "white",
        antithesis: "white",
        primaryLowFade: "rgba(255,255,255,0.9)",
        primaryMidFade: "rgba(255,255,255,0.7)",
        primaryHighFade: "rgba(255,255,255,0.5)",
        primaryVeryHighFade: "rgba(255,255,255,0.2)",
        secondary: "#2F87FF",
        secondaryVibrant: "#009DFF",
        tertiary: "#62666e",
        quaternary: "#1A1A1A",
        quinary06opacity: "rgba(50, 50, 50, 0.6)",
        quinary1opacity: "rgba(50, 50, 50, 1)",
    },
    autumnLight: {
        name: "autumnLight",
        overall: "light",
        background: "#FDF5E6",
        backgroundGradient: ["#414857", "#2B303A"],
        primary: "white",
        antithesis: "white",
        primaryLowFade: "rgba(139,69,19,0.9)",
        primaryMidFade: "rgba(139,69,19,0.7)",
        primaryHighFade: "rgba(139,69,19,0.5)",
        primaryVeryHighFade: "rgba(139,69,19,0.2)",
        secondary: "#FFD700",
        tertiary: "#32CD32",
        quaternary: "#FF4500",
    },
    lavenderDream: {
        name: "lavenderDream",
        overall: "light",
        background: "#E6E6FA",
        backgroundGradient: ["#414857", "#2B303A"],
        primary: "white",
        antithesis: "white",
        primaryLowFade: "rgba(147,112,219,0.9)",
        primaryMidFade: "rgba(147,112,219,0.7)",
        primaryHighFade: "rgba(147,112,219,0.5)",
        primaryVeryHighFade: "rgba(147,112,219,0.2)",
        secondary: "#7B68EE",
        tertiary: "#9932CC",
        quaternary: "#BA55D3",
    },


    // Add more color themes here
};

export default colorThemes;
