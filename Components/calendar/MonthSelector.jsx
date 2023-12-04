import React, { useEffect, useRef, useContext, memo, useState } from "react";
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
    PanResponder,
    Pressable,
} from "react-native";
import Day from "./day";
import YearSelector from "./yearSelector";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const screenWidth = Dimensions.get("window").width;

export default MonthSelector = ({
    currentYear,
    currentMonth,
    decideMonthForArray,
}) => {
    const { theme } = useContext(FlatListRefContext);
    const heightRef = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();
    const [showingMenu, setShowingMenu] = useState(false);

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

    const interpolatedHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 200],
    });

    const interpolatedWidth = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "70%"],
    });

    const interpolatedTop = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [Constants.statusBarHeight, 50],
    });

    const interpolatedBackgroundColor = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(50, 50, 50, 0)", "rgba(50, 50, 50, 1)"],
    });

    const interpolateParentHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenHeight],
    });

    const interpolateParentWidth = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenWidth],
    });

    const showMenu = (dir) => {
        Animated.spring(heightRef, {
            toValue: dir,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                flex: 1,
                zIndex: 50,
            }}
        >
            <AnimatedPressable
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: interpolateParentHeight,
                    width: interpolateParentWidth,
                    zIndex: 50,
                }}
                onPress={() => showMenu(0)}
            ></AnimatedPressable>

            <Animated.View
                style={{
                    height: interpolatedHeight,
                    backgroundColor: interpolatedBackgroundColor,
                    borderRadius: 10,
                    left: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    top: interpolatedTop,
                    zIndex: 51,
                }}
            >
                <FlatList
                    scrollEnabled={true}
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    data={[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                    ]}
                    keyExtractor={(item, index) => item + index}
                    contentContainerStyle={{}}
                    //initialScrollIndex={currentMonth - 1}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    showMenu(1);
                                    console.log("pressed");
                                }}
                                style={{
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={[
                                        {
                                            color: theme.primary,
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 34,
                                        },
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </Animated.View>
        </View>
    );
};
{
    /* {new Date(
                        Date.UTC(currentYear, decideMonthForArray(currentMonth))
                    ).toLocaleDateString(undefined, { month: "long" })} */
}
