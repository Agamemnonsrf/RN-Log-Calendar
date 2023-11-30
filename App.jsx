import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Animated, View, Dimensions, Text } from "react-native";
import Layout from "./Components/layout/layout";

import FlatListRefContext from "./Components/context/flatListContext";
import CurrentMonth from "./Components/calendar/currentMonth";
import BarsMenuIcon from "./Components/layout/BarsMenuIcon";
import colorThemes from "./Components/data/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
//expo splashscreen
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import NoteInput from "./Components/calendar/NoteInput";

const screenWidth = Dimensions.get("window").width;
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [theme, setTheme] = useState(colorThemes["defaultDark"]);
    const [appIsReady, setAppIsReady] = useState(false);
    const [focused, setFocused] = useState(false);
    const position1 = useRef(new Animated.Value(0)).current;
    const dropDownRef = useRef();
    const sideMenuRef = useRef();
    const dayRef = useRef();
    const focusPanRef = useRef(new Animated.Value(0)).current;

    const [fontsLoaded] = useFonts({
        "Poppins-Black": require("./assets/fonts/Poppins/Poppins-Black.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        "Poppins-Regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-Light": require("./assets/fonts/Poppins/Poppins-Light.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            try {
                const theme = await AsyncStorage.getItem("theme");
                if (theme) {
                    setTheme(colorThemes[theme]);
                } else {
                    await AsyncStorage.setItem("theme", "defaultDark");
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepare();
    }, []);

    useEffect(() => {
        Animated.timing(position1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [currentMonth, currentYear]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);



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

    const interpolateFocus = focusPanRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -screenWidth],
    });

    useEffect(() => {
        console.log("focused")
        if (focused) {

            Animated.spring(focusPanRef, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.spring(focusPanRef, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
            }).start();
        }
    }, [focused])


    if (!appIsReady || !fontsLoaded) {
        return null;
    }
    return (
        <FlatListRefContext.Provider
            value={{
                selectNewMonth,
                selectNewYear,
                setCurrentMonth,
                currentMonth,
                currentYear,
                sideMenuRef,
                dropDownRef,
                dayRef,
                theme,
                setTheme,
            }}
        >
            <View
                style={[
                    styles.container,

                ]}
                onLayout={onLayoutRootView}
            >
                <LinearGradient
                    colors={theme.backgroundGradient}
                    style={styles.background}
                    end={{ x: 1, y: 1 }}
                />
                <Layout>
                    <Animated.View
                        style={{
                            transform: [{ translateX: position1, }],
                            width: "100%",
                            justifyContent: "space-between",
                            height: "100%"
                        }}
                    >
                        <Animated.View
                            style={{
                                height: 50,
                                width: "100%",
                                right: interpolateFocus
                            }}
                        >
                            <BarsMenuIcon />
                        </Animated.View>
                        <CurrentMonth
                            currentMonth={currentMonth}
                            setCurrentYear={setCurrentYear}
                            currentYear={currentYear}
                            focused={focused}
                        />
                        <View style={{ height: "37%" }}>
                            <NoteInput ref={dropDownRef} focused={focused} setFocused={setFocused} />
                        </View>
                    </Animated.View>
                </Layout>
                <StatusBar style="light" translucent={true} />
            </View>
        </FlatListRefContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }, background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",

    }
});
