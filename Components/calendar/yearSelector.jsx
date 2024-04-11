import React, { useEffect, useRef, useContext, memo, useState } from "react";
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
    PanResponder,
    Pressable, StatusBar as RNStatusBar
} from "react-native";
import Day from "./day";
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
    selectNewYear
}) => {
    const { theme } = useContext(FlatListRefContext);
    const heightRef = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();
    const [showingMenu, setShowingMenu] = useState({ state: false, month: 0 });

    const interpolatedHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [38, 200],
    });

    const interpolatedWidth = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [
            "22%",
            "30%",
        ],
    });

    const interpolatedBackgroundColor = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(50, 50, 50, 0)", "rgba(50, 50, 50, 1)"],
    });

    const renderItem = ({ item, index }) => {
        return (
            <Pressable
                onPress={() => {
                    setShowingMenu((prev) => {
                        return { state: !prev.state, index };
                    });
                }}
                style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    marginBottom: 0,
                }}
            >
                <Text
                    style={[
                        {
                            color: theme.primary,
                            fontFamily: "Poppins-Regular",
                            fontSize: 21,
                        },
                    ]}
                >
                    {index}
                </Text>
            </Pressable>
        );
    };

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            if (showingMenu.state) {
                showMenu();
            } else {
                hideMenu(showingMenu.index);
            }
        }
    }, [showingMenu]);

    const showMenu = () => {
        Animated.spring(heightRef, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
        // flatListRef.current.scrollToIndex({
        //     index: months.indexOf(showingMenu.month) - 2,
        //     animated: true,
        // });
    };

    const hideMenu = (year = 0) => {
        console.log(year)
        Animated.parallel([
            Animated.spring(heightRef, {
                toValue: 0,
                useNativeDriver: false,
            }),
            flatListRef.current.scrollToIndex({
                index: year,
                animated: true,
            }),
        ]).start();
        setTimeout(() => {
            selectNewYear(year);
        }, 300)
    };

    return (
        <Animated.View
            style={{
                height: interpolatedHeight,
                backgroundColor: interpolatedBackgroundColor,
                borderRadius: 10,
                zIndex: 51,
                width: interpolatedWidth,
                borderWIdth: 2,
                borderColor: 'green'
            }}
        >
            <FlatList
                scrollEnabled={showingMenu.state}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => {
                    return { length: 50, offset: 50 * index, index };
                }}
                data={Array(4000)}
                keyExtractor={(item, index) => index}
                contentContainerStyle={{}}
                initialScrollIndex={currentYear}
                renderItem={(item, index) => renderItem(item, index)}
                ListFooterComponent={() => {
                    return <View style={{ height: 100 }} />;
                }}
            />
        </Animated.View>

    );
};
{
    /* {new Date(
                        Date.UTC(currentYear, decideMonthForArray(currentMonth))
                    ).toLocaleDateString(undefined, { month: "long" })} */
}
