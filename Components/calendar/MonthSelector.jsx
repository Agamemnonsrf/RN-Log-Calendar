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
import { render } from "react-dom";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const screenWidth = Dimensions.get("window").width;

const months = [
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
];

export default MonthSelector = ({
    currentYear,
    currentMonth,
    decideMonthForArray,
    selectNewMonth,
}) => {
    const { theme } = useContext(FlatListRefContext);
    const heightRef = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();
    const [showingMenu, setShowingMenu] = useState({ state: false, month: 0 });

    const interpolatedHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 200],
    });

    const interpolatedTop = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [
            Constants.statusBarHeight * 2,
            Constants.statusBarHeight * 2 + 20,
        ],
    });

    const interpolatedBackgroundColor = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(50, 50, 50, 0)", "rgba(50, 50, 50, 1)"],
    });

    const renderItem = ({ item }) => {
        return (
            <Pressable
                onPress={() => {
                    setShowingMenu((prev) => {
                        return { state: !prev.state, month: item };
                    });
                }}
                style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    marginBottom: 10,
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
    };

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            console.log(showingMenu.state);
            if (showingMenu.state) {
                console.log("show");
                showMenu();
            } else {
                hideMenu(months.indexOf(showingMenu.month));
            }
        }
    }, [showingMenu]);

    const showMenu = () => {
        Animated.spring(heightRef, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    const hideMenu = (month = 0) => {
        Animated.parallel([
            Animated.spring(heightRef, {
                toValue: 0,
                useNativeDriver: false,
            }),
            flatListRef.current.scrollToIndex({
                index: month,
                animated: true,
            }),
        ]).start(() => {
            selectNewMonth(month + 1);
        });
    };

    return (
        <Animated.View
            style={{
                width: "90%",
                height: interpolatedHeight,
                position: "absolute",
                zIndex: 10,
            }}
        >
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
                    scrollEnabled={showingMenu.state}
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    getItemLayout={(data, index) => {
                        return { length: 60, offset: 60 * index, index };
                    }}
                    data={months}
                    keyExtractor={(item, index) => item + index}
                    contentContainerStyle={{}}
                    initialScrollIndex={currentMonth - 1}
                    renderItem={renderItem}
                    ListFooterComponent={() => {
                        return <View style={{ height: 100 }} />;
                    }}
                />
            </Animated.View>
        </Animated.View>
    );
};
{
    /* {new Date(
                        Date.UTC(currentYear, decideMonthForArray(currentMonth))
                    ).toLocaleDateString(undefined, { month: "long" })} */
}
