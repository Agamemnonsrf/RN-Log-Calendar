import React, { useEffect, useRef, useContext, memo, useState } from "react";
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
    Button,
    Easing,
} from "react-native";
import Day from "./day";
import YearSelector from "./yearSelector";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";
import MonthSelector from "./MonthSelector";
import { LinearGradient } from "expo-linear-gradient";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const screenWidth = Dimensions.get("window").width;
const oneLetterDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const windowWidth = Dimensions.get("window").width;
const windowHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const containerWidth = windowWidth / 7 - 5;
const containerHeight = windowHeight / 12.5;

interface VerticalGradientBorderProps {
    containerHeight: number;
    colAnim: Animated.Value;
    selectedSection: number;
    theme: { primaryHighFade: string };
    numRows: number;
}

const AnimatedVerticalLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const VerticalGradientBorder: React.FC<VerticalGradientBorderProps> = ({ containerHeight, colAnim, selectedSection, theme, numRows }) => {
    const positionAnim = useRef(new Animated.Value(0)).current;

    // Trigger animation when selectedSection changes
    const animateSection = (targetValue: number) => {
        Animated.timing(positionAnim, {
            toValue: targetValue,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true, // We aren't animating layout directly
        }).start();
    };
    //I want to make a section useRef which cycles between number 2-7,
    //so it will first be 2, then 3, then 4, then 5, then 6, then 7, then 2, then 3, etc.
    const section = useRef(1);

    const handlePress = () => {
        section.current = section.current === numRows ? 1 : section.current + 1;
        const targetPosition = (section.current - 1) / 6; // Map the section to [0, 1] range
        console.log(section);
        animateSection(section.current);
        console.log(xInterpolation)
    };


    // Interpolating column animation based on selected section
    const value = colAnim.interpolate({
        inputRange: Array.from({ length: numRows }, (_, i) => i),
        outputRange: Array.from({ length: numRows }, (_, i) => {
            return i * (containerHeight + 2);
        })
    });
    console.log(numRows)
    const offset = numRows === 6 ? 190 : 160;
    const xInterpolation = positionAnim.interpolate({
        inputRange: Array.from({ length: numRows }, (_, i) => i),
        outputRange: Array.from({ length: numRows }, (_, i) => {
            return (i * (containerHeight - 3)) - offset;
        })
    })
    console.log(xInterpolation)
    return (
        <>
            <View style={{
                position: "absolute",
                zIndex: 100,
            }}>
                <Button title="animate opacity" onPress={handlePress} />
            </View>

            <Animated.View style={{
                width: containerHeight,
                position: 'absolute',
                transform: [{ translateX: value }, { translateY: xInterpolation }],
                height: '100%',
            }}>
                {/* Left Border with Animated Gradient */}
                <AnimatedVerticalLinearGradient
                    colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }} // Vertical gradient
                    locations={[0.3, 0.6, 0.9]} // Dynamic gradient stops
                    style={{ width: 1, height: '100%', position: 'absolute', left: 0 }}
                />

                {/* Right Border with Animated Gradient */}
                <AnimatedVerticalLinearGradient
                    colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0.3, 0.6, 0.9]} // Dynamic gradient stops
                    style={{ width: 1, height: '100%', position: 'absolute', right: 0 }}
                />
            </Animated.View>
        </>
    );
};


interface GradientBorderProps {
    containerHeight: number;
    rowAnim: Animated.Value;
    selectedSection: number; // The number between 1 and 6
    theme: { primaryHighFade: string };
}
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const GradientBorder: React.FC<GradientBorderProps> = ({ containerHeight, rowAnim, selectedSection, theme }) => {
    const positionAnim = useRef(new Animated.Value(0)).current;

    // Trigger animation when selectedSection changes
    const animateSection = (targetValue: number) => {
        Animated.timing(positionAnim, {
            toValue: targetValue,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true, // We aren't animating layout directly
        }).start();
    };

    // Calculate the gradient position based on selectedSection (scaled to percentage)
    const section = useRef(1);
    const handlePress = () => {
        section.current = section.current === 7 ? 1 : section.current + 1;
        console.log(section);
        animateSection(section.current);
    };
    const offset = 0;
    const yInterpolation = positionAnim.interpolate({
        inputRange: Array.from({ length: 7 }, (_, i) => i),
        outputRange: Array.from({ length: 7 }, (_, i) => containerHeight * (i + 1) - (containerHeight / 2) - 274)
    })

    const value = rowAnim.interpolate({
        inputRange: Array.from({ length: 7 }, (_, i) => i),
        outputRange: Array.from({ length: 7 }, (_, i) => containerHeight * (i + 1) - (containerHeight / 2) + 4)
    });

    return (
        <>
            <View style={{
                position: "absolute",
                top: -30,
                left: 0,
                zIndex: 100,
            }}>
                <Button title="animate opacity"
                    onPress={handlePress} />
            </View>
            <Animated.View style={{
                height: containerHeight,
                position: 'absolute',
                transform: [{ translateY: value }, { translateX: yInterpolation }],
                width: '100%',
            }}>
                {/* Top Border with Animated Gradient */}
                <AnimatedLinearGradient
                    colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0.3, 0.6, 0.9]} // Dynamic gradient stops
                    style={{ height: 1, width: '100%', position: 'absolute', top: 0 }}
                />

                {/* Bottom Border with Animated Gradient */}
                <AnimatedLinearGradient
                    colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0.3, 0.6, 0.9]}
                    style={{ height: 1, width: '100%', position: 'absolute', bottom: 0 }}
                />
            </Animated.View>
        </>
    );
};





const CurrentMonth = ({ currentMonth, setCurrentYear, currentYear }: { currentMonth: number, setCurrentYear: Function, currentYear: number }) => {
    const { theme } = useContext(FlatListRefContext);
    const focusPanRef = useRef(new Animated.Value(0)).current;
    const rowAnim = useRef(new Animated.Value(2)).current;  // Initial row
    const colAnim = useRef(new Animated.Value(2)).current;  // Initial col
    const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

    const getDayOffset = (month: number, year: number, day: number) => {
        let dayOfWeek = new Date(year, month - 1, day).getDay() - 1;
        return dayOfWeek === -1 ? 6 : dayOfWeek;
    };

    const getStartingDayOffset = (month: number, year: number) => getDayOffset(month, year, 1);

    const getEndingDayOffset = (month: number, year: number) =>
        getDayOffset(month, year, getDaysInMonth(month, year));

    const decideMonth = (month: number, offset: number) => {
        const adjustedMonth = month + offset;
        if (adjustedMonth === 0) return 12;
        if (adjustedMonth === 13) return 1;
        return adjustedMonth;
    };

    const decideMonthForArray = (month: number) => {
        if (month === 12) return 11;
        if (month === -1) return 0;
        return month - 1;
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const startOffset = getStartingDayOffset(currentMonth, currentYear);
    const endOffset = getEndingDayOffset(currentMonth, currentYear);

    const days = [];

    // Start month
    for (let i = 0; i < startOffset; i++) {
        const yearOffset = currentMonth === 1 ? 1 : 0;
        const newmonth = new Date(currentYear - yearOffset, currentMonth, 0);
        days.push({
            day:
                getDaysInMonth(newmonth.getMonth(), newmonth.getFullYear()) - i,
            month: decideMonth(newmonth.getMonth() - 1, 1),
            year: newmonth.getFullYear(),
        });
    }
    days.reverse();

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, month: currentMonth, year: currentYear });
    }

    // End month
    for (let i = 1; i <= endOffset; i++) {
        const newmonth = new Date(currentYear, currentMonth, 1);
        days.push({
            day: i,
            month: decideMonth(newmonth.getMonth(), 1),
            year: newmonth.getFullYear(),
        });
    }

    const ITEM_HEIGHT = 64; // height of each item
    const NUM_COLUMNS = 7;
    const numRows = Math.ceil(days.length / NUM_COLUMNS);

    // Calculate the total height of the FlatList
    const totalHeight = numRows * ITEM_HEIGHT;
    const interpolateFocus = focusPanRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -screenWidth],
    });

    const verticalIndicators = () => {
        return (
            <VerticalGradientBorder
                containerHeight={containerHeight}
                colAnim={colAnim}
                selectedSection={3}
                theme={theme}
                numRows={numRows}
            />
            // <Animated.View style={{
            //     width: containerHeight,
            //     borderLeftWidth: 1,
            //     borderRightWidth: 1,
            //     borderLeftColor: theme.primaryHighFade,
            //     borderRightColor: theme.primaryHighFade,
            //     position: "absolute",
            //     transform: [{ translateX: value }],
            //     height: "100%",
            // }} />
        )
    }

    const horizontalIndicators = () => {
        const value = rowAnim.interpolate({
            inputRange: [1, 2, 3, 4, 5, 6],
            outputRange: Array.from({ length: 6 }, (_, i) => containerHeight * (i + 1) - (containerHeight / 2) + 4)
        });
        return (
            <GradientBorder
                containerHeight={containerHeight}
                rowAnim={rowAnim}
                selectedSection={3}
                theme={theme}
            />
            // <Animated.View style={{
            //     height: containerHeight,
            //     borderTopWidth: 1,
            //     borderBottomWidth: 1,
            //     borderTopColor: theme.primaryHighFade,
            //     borderBottomColor: theme.primaryHighFade,
            //     position: "absolute",
            //     transform: [{ translateY: value }],
            //     width: "100%",
            // }} />
        )
    }

    const goIndicatorToRow = (row: number) => {
        Animated.timing(rowAnim, {
            toValue: row,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    const goIndicatorToColumn = (column: number) => {
        Animated.timing(colAnim, {
            toValue: column,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    return (
        <View style={{ position: "relative" }}>
            {horizontalIndicators()}
            {verticalIndicators()}
            <View style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 100,
            }}>
                <Button title="go to random row"
                    onPress={() => {
                        const row = Math.floor(Math.random() * numRows);
                        goIndicatorToRow(row)
                    }} />
            </View>
            <View style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                zIndex: 100,
            }}>
                <Button title="go to random col"
                    onPress={() => {
                        const col = Math.floor(Math.random() * NUM_COLUMNS);
                        goIndicatorToColumn(col)
                    }} />
            </View>
            <FlatList
                ListHeaderComponent={() => {
                    return (
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                zIndex: -10,
                                marginTop: 10
                            }}
                        >
                            {oneLetterDays.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: screenWidth / 7,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.primary,
                                            fontFamily: "Poppins-Light",
                                        }}
                                    >
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    );
                }}
                renderItem={({ item }) => (
                    <Day
                        day={item.day}
                        isCurrentMonth={item.month === currentMonth}
                        month={item.month}
                        year={item.year}
                        isToday={
                            item.day === new Date().getDate() &&
                            item.month === new Date().getMonth() + 1 &&
                            item.year === new Date().getFullYear()
                        }
                    />
                )}
                data={days}
                keyExtractor={(item, index) =>
                    new Date(
                        item.year,
                        item.month + 1,
                        item.day
                    ).toDateString() + index.toString()
                }
                numColumns={7}
                style={{
                    alignSelf: "center",
                }}
                contentContainerStyle={{}}
                scrollEnabled={false}
                getItemLayout={(data, index) => ({
                    length: totalHeight,
                    offset: totalHeight * index,
                    index,
                })}
            />
        </View>
    );
};

export default memo(CurrentMonth);

const styles = StyleSheet.create({
    bigText: {
        fontSize: 34,
    },
});
