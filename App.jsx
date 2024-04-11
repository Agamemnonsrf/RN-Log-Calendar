import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    StyleSheet,
    Animated,
    View,
    Dimensions,
    Pressable,
    Text,
    Button,
    TouchableOpacity,
    StatusBar as RNStatusBar
} from "react-native";
import Layout from "./Components/layout/layout";

import FlatListRefContext from "./Components/context/flatListContext";
import CurrentMonth from "./Components/calendar/currentMonth";
import BarsMenuIcon from "./Components/layout/BarsMenuIcon";
import colorThemes from "./Components/data/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
//expo splashscreen
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import NoteInput from "./Components/calendar/NoteInput";
import SideMenu from "./Components/layout/SideMenu";
import MonthSelector from "./Components/calendar/MonthSelector";
import YearSelector from "./Components/calendar/yearSelector";

const screenWidth = Dimensions.get("window").width;
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [theme, setTheme] = useState(colorThemes["defaultDark"]);
    const [appIsReady, setAppIsReady] = useState(false);
    const position1 = useRef(new Animated.Value(0)).current;
    const returnButtonPosition = useRef(new Animated.Value(0)).current;
    const dropDownRef = useRef();
    const sideMenuRef = useRef();
    const dayRef = useRef();

    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
            duration: 200,
            useNativeDriver: false,
        }).start();

        const isItTheCurrentDate = currentMonth !== new Date().getMonth() + 1 || currentYear !== new Date().getFullYear()

        Animated.timing(returnButtonPosition, {
            toValue: isItTheCurrentDate ? 0 : 1,
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
        let previousMonth;
        setCurrentMonth((prev) => {
            previousMonth = prev;
            return prev;
        });

        if (newMonth === previousMonth) return;
        Animated.timing(position1, {
            toValue: -screenWidth,
            duration: 200,
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
            duration: 200,
            useNativeDriver: false,
        }).start(() => {
            setCurrentYear(newYear);
        });
    };

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
            <View style={[styles.container]} onLayout={onLayoutRootView}>
                <LinearGradient
                    colors={theme.backgroundGradient}
                    style={styles.background}
                    end={{ x: 1, y: 1 }}
                />

                {/* <SideMenu ref={sideMenuRef} /> */}
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        zIndex: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.primaryHighFade,
                    }}
                >
                    <View style={{
                        position: "absolute",
                        left: 10,
                        bottom: 10
                    }}>
                        <BarsMenuIcon />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-end", gap: 8 }}>

                        <MonthSelector
                            currentYear={currentYear}
                            currentMonth={currentMonth}
                            selectNewMonth={selectNewMonth}
                        />
                        <YearSelector currentYear={currentYear} selectNewYear={selectNewYear} />
                    </View>
                </View>

                <Animated.View
                    style={{
                        opacity: position1.interpolate({
                            inputRange: [-screenWidth, 0],
                            outputRange: [0, 1],
                        }),
                        // transform: [{ opacity: position1 === 0 ? 1 : 0 }],
                    }}
                >
                    <CurrentMonth
                        currentMonth={currentMonth}
                        setCurrentYear={setCurrentYear}
                        currentYear={currentYear}
                    />
                </Animated.View>
                <View style={{
                    flex: 1,

                    alignItems: "center",

                }}>
                    <NoteInput ref={dropDownRef} />
                </View>
                <AnimatedTouchableOpacity
                    onPress={() => {
                        //TODO: make smooth
                        setCurrentMonth(new Date().getMonth() + 1);
                        setCurrentYear(new Date().getFullYear());
                    }}
                    style={{
                        position: "absolute",
                        bottom: -15,
                        right: 10,
                        zIndex: 100,
                        backgroundColor: "white",
                        padding: 10,
                        paddingBottom: 20,
                        borderRadius: 10,
                        transform: [{ translateY: returnButtonPosition.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) }]
                    }}>
                    <Text style={{
                        color: "black",
                        fontFamily: "Poppins-Bold",
                    }}>Return To Current Month</Text>
                </AnimatedTouchableOpacity>
                <StatusBar style="light" translucent={true} />
            </View>
        </FlatListRefContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: RNStatusBar.currentHeight + 10
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "120%",
    },
});
