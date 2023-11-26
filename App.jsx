import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Animated, View, Dimensions } from "react-native";
import Layout from "./Components/layout/layout";

import FlatListRefContext from "./Components/context/flatListContext";
import CurrentMonth from "./Components/calendar/currentMonth";
import BarsMenuIcon from "./Components/layout/BarsMenuIcon";
import colorThemes from "./Components/data/themes";

const screenWidth = Dimensions.get("window").width;

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [theme, setTheme] = useState(colorThemes["defaultDark"]);

    const position1 = useRef(new Animated.Value(0)).current;
    const dropDownRef = useRef();
    const sideMenuRef = useRef();
    const dayRef = useRef();

    const selectNewMonth = (newMonth) => {
        let newMonthCall;
        setCurrentMonth((prev) => {
            newMonthCall = prev;
            return prev;
        });

        if (newMonth === newMonthCall) return;
        Animated.timing(position1, {
            toValue: -screenWidth,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            setCurrentMonth(newMonth);
        });
    };

    const selectNewYear = (newYear) => {
        let newYearCall;
        setCurrentYear((prev) => {
            newYearCall = prev;
            return prev;
        });

        if (newYear === newYearCall) return;
        Animated.timing(position1, {
            toValue: -screenWidth,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            setCurrentYear(newYear);
        });
    };

    useEffect(() => {
        Animated.timing(position1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [currentMonth, currentYear]);

    return (
        <FlatListRefContext.Provider
            value={{
                selectNewMonth,
                selectNewYear,
                setCurrentMonth,
                currentMonth,
                currentYear,
                dropDownRef,
                sideMenuRef,
                dayRef,
                theme,
            }}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.background },
                ]}
            >
                <Layout>
                    <Animated.View
                        style={{
                            transform: [{ translateX: position1 }],
                            width: "100%",
                        }}
                    >
                        <View
                            style={{
                                height: 50,
                                width: "100%",
                            }}
                        >
                            <BarsMenuIcon />
                        </View>
                        <CurrentMonth
                            currentMonth={currentMonth}
                            setCurrentYear={setCurrentYear}
                            currentYear={currentYear}
                        />
                    </Animated.View>
                </Layout>
                <StatusBar style="light" translucent={false} />
            </View>
        </FlatListRefContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
