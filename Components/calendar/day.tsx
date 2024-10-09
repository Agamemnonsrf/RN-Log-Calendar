import React, { useContext, useEffect, useState, useRef } from "react";
import FlatListRefContext from "../context/flatListContext";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const windowWidth = Dimensions.get("window").width;
const windowHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const containerWidth = windowWidth / 7 - 5;
const containerHeight = windowHeight / 12.5;

function hexToRgb(hex: any) {
    // Remove the leading '#' if it's there
    hex = hex.replace(/^#/, '');

    // Parse the three color components
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

function getComplementaryColor(hex: string): string {
    const [r, g, b] = hexToRgb(hex);

    // Invert the colors to get the complement
    const complementR = 255 - r;
    const complementG = 255 - g;
    const complementB = 255 - b;

    // Convert back to hex
    return rgbToHex(complementR, complementG, complementB);
}

function rgbToHex(r: number, g: number, b: number): string {
    // Convert each RGB component to a two-digit hex value
    return (
        "#" +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
}



function getLuminance(r: any, g: any, b: any) {
    // Normalize the RGB values by dividing them by 255
    const normalized = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    // Calculate luminance using the standard formula
    return normalized[0] * 0.2126 + normalized[1] * 0.7152 + normalized[2] * 0.0722;
}

function isDarkColor(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    const luminance = getLuminance(r, g, b);

    // Compare luminance to 0.5 (midpoint) to determine if it's dark or light
    return luminance < 0.4;
}



const coolors = [
    "#13C4A3",
    "#EEC643",
    "#CA3C25",
    "#EEF0F2",
    "#5887FF",
    "#E4BE9E",
    "#FF8C61",
    "#475590",
    "#B96D40",
];

const Day = ({ day, isCurrentMonth, month, isToday, year, row, col, setSelectedCol, setSelectedRow }: {
    day: number, isCurrentMonth: boolean, month: number, isToday: boolean, year: number, row: number, col: number,
    setSelectedCol: React.Dispatch<React.SetStateAction<number>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>
}) => {
    const { dropDownRef, theme } = useContext(FlatListRefContext);
    const [hasData, setHasData] = useState("");
    const [color, setColor] = useState("");
    const colorScrollViewRef = useRef<ScrollView | null>(null);
    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);
    const colorSelectorRef = useRef(new Animated.Value(0)).current;

    const showColorSelector = () => {
        Animated.spring(colorSelectorRef, {
            toValue: 1,
            useNativeDriver: false,
        }).start(() => {
            if (color !== "")
                colorScrollViewRef.current?.scrollTo({
                    x:
                        coolors.indexOf(color) * 35 + 70
                    , y: 0, animated: true
                });
        });
    };

    const hideColorSelector = () => {
        Animated.spring(colorSelectorRef, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    };

    const getColor = async () => {
        try {
            const value = await AsyncStorage.getItem(
                new Date(year, month - 1, day).toDateString() + "color"
            );
            if (value !== null) {
                return value;
            } else return null;
        } catch (e) {
            console.log(e);
        }
    };

    const saveColor = async (date: Date, color: string) => {
        try {
            await AsyncStorage.setItem(date.toDateString() + "color", color);
        } catch (e) {
            console.log(e);
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem(
                new Date(year, month - 1, day).toDateString()
            );
            if (value !== null) {
                return value;
            } else return null;
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getColor().then((color) => color && setColor(color));
        getData().then((value) => value && setHasData(value));
    }, []);

    const interpolatedColorSelectorWidth = colorSelectorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 170],
    });

    const interpolatedColorSelectorHeight = colorSelectorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 40],
    });

    const interpolatedColorWidth = colorSelectorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 25],
    });

    const interpolatedColorHeight = colorSelectorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 25],
    });

    const interpolatedColorSelectorPosition = colorSelectorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "-50%"],
    });

    return (
        <>
            <View
                style={[
                    {
                        width: windowWidth / 7,
                        height: containerHeight,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Animated.View
                    style={{
                        height: interpolatedColorSelectorHeight,
                        width: interpolatedColorSelectorWidth,
                        opacity: colorSelectorRef.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                        borderRadius: 100,
                        backgroundColor: theme.background,
                        position: "absolute",
                        top: interpolatedColorSelectorPosition,
                        zIndex: 10,
                        overflow: "hidden",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}
                >
                    <ScrollView
                        horizontal
                        contentContainerStyle={{
                            justifyContent: "space-around",
                            gap: 10,
                            paddingHorizontal: 80,
                        }}
                        showsHorizontalScrollIndicator={false}
                        snapToStart
                        contentOffset={{ x: 70, y: 0 }}
                        ref={colorScrollViewRef}
                    >
                        <AnimatedTouchableOpacity
                            key={"close color selector"}
                            style={{
                                width: interpolatedColorWidth,
                                height: interpolatedColorHeight,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: theme.primary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                hideColorSelector();
                            }}
                        >
                            <MaterialIcons
                                name="close-fullscreen"
                                size={12}
                                color={theme.primary}
                            />
                        </AnimatedTouchableOpacity>
                        <AnimatedTouchableOpacity
                            key={"remove color"}
                            style={{
                                width: interpolatedColorWidth,
                                height: interpolatedColorHeight,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: theme.primary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                setColor("");
                                saveColor(new Date(year, month - 1, day), "");
                                hideColorSelector();
                            }}
                        >
                            {<MaterialIcons
                                name="close"
                                size={12}
                                color={theme.primary}
                            />}
                        </AnimatedTouchableOpacity>
                        {coolors.map((coolor) => (
                            <AnimatedTouchableOpacity
                                key={coolor}
                                style={{
                                    width: interpolatedColorWidth,
                                    height: interpolatedColorHeight,
                                    borderRadius: 100,
                                    backgroundColor: coolor,
                                    position: "relative"
                                }}
                                onPress={() => {
                                    setColor(coolor);
                                    saveColor(new Date(year, month - 1, day), coolor);
                                    hideColorSelector();
                                }}
                            >
                                {coolor === color &&
                                    <View key={coolor + "indicator"} style={{
                                        position: "absolute",
                                        width: 25,
                                        height: 25,
                                        borderRadius: 100,
                                        borderWidth: 2,
                                        borderColor: theme.primary,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                    }}>
                                        <MaterialIcons
                                            name="check"
                                            size={12}
                                            color={isDarkColor(coolor) ? theme.primary : theme.background} />
                                    </View>}
                            </AnimatedTouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 33,
                        height: 33,
                        backgroundColor: color !== "" ? color : "transparent",
                        borderRadius: 5,
                        overflow: "hidden",
                    }}
                    onPress={() => {
                        dropDownRef.current && dropDownRef.current.showDropdown(
                            year,
                            month,
                            day,
                            hasData || "",
                            setHasData,
                            setColor,
                            color
                        );
                        //find the row and column for this day:
                        setSelectedCol(col);
                        setSelectedRow(row);
                        console.log(row, col);
                    }}
                    onLongPress={() => showColorSelector()}
                >
                    {isToday && (
                        <View
                            style={{
                                top: 1,
                                left: 1,
                                zIndex: 10,
                                position: "absolute",
                            }}
                        >
                            <MaterialIcons
                                name="today"
                                size={9}
                                color={color ? isDarkColor(color) ? "white" : "black" : theme.primary}
                            />
                        </View>
                    )}
                    {hasData && (
                        <View style={{
                            position: "absolute",
                            top: 1,
                            right: 1,
                            zIndex: 10,
                        }}>
                            <MaterialCommunityIcons
                                name="checkbox-blank-circle"
                                size={6}
                                color={color ? isDarkColor(color) ? "white" : "black" : theme.primary}
                            />
                        </View>
                    )}
                    <Text
                        style={{
                            color: isCurrentMonth
                                ? color !== ""
                                    ? isDarkColor(color) ? "white" : "black"
                                    : theme.primary
                                : theme.primaryHighFade,
                            fontSize: containerHeight / 3.5,
                            fontFamily: "Poppins-Light",
                            padding: 0,
                            margin: 0,

                        }}
                    >
                        {day}
                    </Text>
                    {/* <View
                    style={{
                        borderRadius: 100,
                        width: containerWidth * 0.5,
                        height: 5,
                        backgroundColor: color ? color : "transparent",
                        bottom: 0,
                        position: "absolute",
                    }}
                /> */}
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default Day;
