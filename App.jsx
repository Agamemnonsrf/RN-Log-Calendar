import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Animated, View, Dimensions } from "react-native";
import Layout from "./Components/layout/layout";

import FlatListRefContext from "./Components/context/flatListContext";
import CurrentMonth from "./Components/calendar/currentMonth";

const screenWidth = Dimensions.get("window").width;

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showDropDown, setShowDropDown] = useState(false);

    const position1 = useRef(new Animated.Value(0)).current;
    const dropDownRef = useRef();
    const dayRef = useRef();

    function selectNewMonth(newMonth) {
        let newMonthCall;
        setCurrentMonth(prev => {
            newMonthCall = prev;
            return prev;
        });

        if (newMonth === newMonthCall) return;
        Animated.timing(position1, {
            toValue: -screenWidth,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            setCurrentMonth(newMonth)
        });
    }

    useEffect(() => {
        Animated.timing(position1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [currentMonth]);

    return (
        <FlatListRefContext.Provider value={{ selectNewMonth, setCurrentMonth, currentMonth, currentYear, dropDownRef, dayRef }}>
            <View style={[styles.container, styles.backgroundDark]}>
                <Layout>
                    <Animated.View
                        style={{ transform: [{ translateX: position1 }], width: "100%" }}
                    >
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

    backgroundLight: {
        backgroundColor: "white",
    },
    backgroundDark: {
        backgroundColor: "#2B303A",
    },
    textDark: {
        color: "white",
    },
    bigText: {
        fontSize: 34,
    },

    monthText: {
        fontSize: 44,
        fontWeight: "bold",
        color: "white",
    },
});
