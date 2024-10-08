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

const coolors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
];

const Day = ({ day, isCurrentMonth, month, isToday, year }) => {
    const { dropDownRef, theme } = useContext(FlatListRefContext);
    const [hasData, setHasData] = useState("");
    const [color, setColor] = useState("");

    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);
    const colorSelectorRef = useRef(new Animated.Value(0)).current;

    const showColorSelector = () => {
        Animated.spring(colorSelectorRef, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
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
                            paddingHorizontal: 10,
                        }}
                        showsHorizontalScrollIndicator={false}
                    >
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
                                setColor("white");
                                hideColorSelector();
                            }}
                        >
                            {<MaterialIcons
                                name="close"
                                size={10}
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
                                }}
                                onPress={() => {
                                    setColor(coolor);
                                    hideColorSelector();
                                }}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 30,
                        height: 30,
                        backgroundColor: color ? color : "transparent",
                        borderRadius: 5,
                        overflow: "hidden",
                    }}
                    onPress={() => {
                        dropDownRef.current.showDropdown(
                            year,
                            month,
                            day,
                            hasData || "",
                            setHasData,
                            setColor,
                            color
                        );
                    }}
                    onLongPress={() => showColorSelector()}
                >
                    {isToday && (
                        <View
                            style={{
                                bottom: -1,
                                zIndex: 10,
                            }}
                        >
                            <MaterialIcons
                                name="today"
                                size={10}
                                color={color ? "black" : theme.primary}
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
                                color={color ? "black" : theme.primary}
                            />
                        </View>
                    )}
                    <Text
                        style={{
                            color: isCurrentMonth
                                ? color
                                    ? "black"
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
