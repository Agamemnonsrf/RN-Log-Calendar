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
        outputRange: [0, 200],
    });

    const interpolatedBackgroundColor = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(50, 50, 50, 0)", "rgba(50, 50, 50, 1)"],
    });

    const interpolateParentHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const interpolateParentWidth = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const showMenu = (dir) => {
        Animated.spring(heightRef, {
            toValue: dir,
            useNativeDriver: false,
        }).start();
    };

    return (
        <>
            <AnimatedPressable
                style={{
                    width: interpolateParentWidth,
                    height: interpolateParentHeight,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99,
                }}
                onPress={() => showMenu(0)}
            ></AnimatedPressable>

            <AnimatedFlatlist
                scrollEnabled={true}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{
                    height: interpolatedHeight,
                    backgroundColor: interpolatedBackgroundColor,
                    borderRadius: 10,
                    transform: [{ translateY: interpolatedTop }],
                    marginBottom: 10,
                    left: 0,
                    zIndex: 100,
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
                contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                }}
                //initialScrollIndex={currentMonth - 1}
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            onPress={() => {
                                showMenu(1);
                                console.log("pressed");
                            }}
                            style={{}}
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
        </>
    );
};
{
    /* {new Date(
                        Date.UTC(currentYear, decideMonthForArray(currentMonth))
                    ).toLocaleDateString(undefined, { month: "long" })} */
}
