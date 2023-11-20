import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    PanResponder,
    Animated,
} from "react-native";
import Layout from "./Components/layout/layout";
import { months } from "./Components/data/data";
import Day from "./Components/calendar/day";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import FlatListRefContext from "./Components/context/flatListContext";

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [monthsLoaded, setMonthsLoaded] = useState([1]);
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                if (pan.x._value > 150) {
                    setCurrentYear((prevYear) => prevYear - 1);
                } else if (pan.x._value < -150) {
                    setCurrentYear((prevYear) => prevYear + 1);
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    const trailStyle = {
        position: "absolute",
        height: 50,
        backgroundColor: "aliceblue",
        left: pan.x.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ["0%", "0%", "100%"],
            extrapolate: "clamp",
        }),
        right: pan.x.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ["100%", "0%", "0%"],
            extrapolate: "clamp",
        }),
    };

    useEffect(() => {
        pan.setValue({ x: 0, y: 0 });
    }, [currentYear]);

    const flatListRef = useRef(null);

    const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

    const getDayOffset = (month, year, day) => {
        let dayOfWeek = new Date(year, month - 1, day).getDay() - 1;
        return dayOfWeek === -1 ? 6 : dayOfWeek;
    };

    const getStartingDayOffset = (month, year) => getDayOffset(month, year, 1);

    const getEndingDayOffset = (month, year) =>
        getDayOffset(month, year, getDaysInMonth(month, year));

    const decideMonth = (month, offset) => {
        const adjustedMonth = month + offset;
        if (adjustedMonth === 0) return 12;
        if (adjustedMonth === 13) return 1;
        return adjustedMonth;
    };

    const decideMonthForArray = (month) => {
        const adjustedMonth = month;
        if (adjustedMonth === 12) return 11;
        if (adjustedMonth === -1) return 0;
        return adjustedMonth - 1;
    };

    const renderDays = (month, year) => {
        const daysInMonth = getDaysInMonth(month, year);
        const startOffset = getStartingDayOffset(month, year);
        const endOffset = getEndingDayOffset(month, year);

        const days = [];

        // Start month
        for (let i = 0; i < startOffset; i++) {
            const yearOffset = month === 1 ? 1 : 0;
            const newmonth = new Date(year - yearOffset, month, 0);

            days.push({
                day: getDaysInMonth(newmonth.getMonth(), year) - i,
                month: decideMonth(newmonth.getMonth() - 1, 1),
                year: year,
            });
        }
        days.reverse();

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, month: month, year: year });
        }

        // End month
        for (let i = 1; i <= endOffset; i++) {
            const newmonth = new Date(year, month, 1);
            days.push({
                day: i,
                month: decideMonth(newmonth.getMonth(), 1),
                year: year,
            });
        }

        const ITEM_HEIGHT = 59; // height of each item
        const NUM_COLUMNS = 7;
        const numRows = Math.ceil(days.length / NUM_COLUMNS);

        // Calculate the total height of the FlatList
        const totalHeight = numRows * ITEM_HEIGHT;

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Animated.View style={trailStyle} />
                <Animated.View
                    style={{
                        transform: [{ translateX: pan.x }],
                    }}
                    {...panResponder.panHandlers}
                >
                    <Text
                        style={{
                            fontSize: 70,
                            fontFamily: "Roboto",
                            fontWeight: "bold",
                            color: "white",
                            marginBottom: 40,
                            letterSpacing: 13,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: 10,
                            padding: 5,
                        }}
                    >
                        {currentYear}
                    </Text>
                </Animated.View>

                <View>
                    <Text style={[styles.textDark, styles.bigText]}>
                        {months[decideMonthForArray(month)].fullName}
                    </Text>
                </View>
                <FlatList
                    renderItem={({ item }) => (
                        <Day
                            day={item.day}
                            isCurrentMonth={item.month === month}
                            month={item.month}
                            isToday={
                                item.day === new Date().getDate() &&
                                item.month === new Date().getMonth() + 1 &&
                                item.year === new Date().getFullYear()
                            }
                        />
                    )}
                    data={days}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={7}
                    style={{
                        flexGrow: 0,
                    }}
                    scrollEnabled={false}
                    getItemLayout={(data, index) => ({
                        length: totalHeight,
                        offset: totalHeight * index,
                        index,
                    })}
                    windowSize={21} // tweak this value as needed
                    maxToRenderPerBatch={20} // tweak this value as needed
                    initialNumToRender={14} // tweak this value as needed
                />
            </View>
        );
    };

    const onStartReached = () => {
        console.log("onStartReached");
        // set the monthsLoaded everytime, but if months loaded is like over 5, cut off the last one too after adding the new one
        setMonthsLoaded((prev) => {
            const newMonths = [prev[0] - 1, ...prev];
            if (newMonths.length > 5) {
                newMonths.pop();
            }
            return newMonths;
        });
    };

    const onEndReached = () => {
        console.log("onEndReached");
        // set the monthsLoaded everytime, but if months loaded is like over 5, cut off the last one too after adding the new one
        setMonthsLoaded((prev) => {
            const newMonths = [...prev, prev[prev.length - 1] + 1];
            if (newMonths.length > 5) {
                newMonths.shift();
            }
            return newMonths;
        });
    };

    return (
        <FlatListRefContext.Provider
            value={{ flatListRef, setMonthsLoaded, monthsLoaded }}
        >
            <View style={[styles.container, styles.backgroundDark]}>
                <Layout
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                >
                    <Text>{monthsLoaded[monthsLoaded.length - 1] === 12}</Text>
                    <FlatList
                        ref={flatListRef}
                        data={monthsLoaded}
                        keyExtractor={(item, index) => `${item}-${currentYear}`}
                        renderItem={({ item }) => renderDays(item, currentYear)}
                        maxToRenderPerBatch={20} // tweak this value as needed
                        initialNumToRender={1} // tweak this value as needed
                        scrollEnabled={false}
                        showDefaultLoadingIndicators={
                            monthsLoaded[monthsLoaded.length - 1] === 12
                        }
                        ListFooterComponent={() => {
                            return (
                                monthsLoaded[monthsLoaded.length - 1] ===
                                    12 && (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 50,
                                                fontWeight: "bold",
                                                color: "white",
                                            }}
                                        >
                                            {currentYear + 1}
                                        </Text>
                                    </View>
                                )
                            );
                        }}
                        ListFooterComponentStyle={{
                            height: 100,
                            backgroundColor:
                                monthsLoaded[monthsLoaded.length - 1] === 12
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "transparent",
                        }}
                    />
                </Layout>
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
        backgroundColor: "#4B5358",
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
