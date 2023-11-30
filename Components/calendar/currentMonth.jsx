import React, { useEffect, useRef, useContext } from "react";
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
} from "react-native";
import { months } from "../data/data";
import Day from "./day";
import YearSelector from "./yearSelector";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;

const oneLetterDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default CurrentMonth = ({
    currentMonth,
    setCurrentYear,
    currentYear,
}) => {
    const { theme } = useContext(FlatListRefContext);

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

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "55%",
            }}
        >

            <View style={{ width: "100%", flexDirection: "row", alignItems: "baseline", borderBottomWidth: 1, borderBottomColor: theme.primaryHighFade }}>
                <Text
                    style={[
                        styles.bigText,
                        { color: theme.primary, fontFamily: "Poppins-Regular", marginLeft: 15 },
                    ]}
                >
                    {new Date(Date.UTC(currentYear, decideMonthForArray(currentMonth))).toLocaleDateString(undefined, { month: "long" })}
                </Text>
                <Text style={{
                    color: theme.primaryMidFade,
                    fontFamily: "Poppins-Regular",
                    marginLeft: 15,
                    fontSize: 20
                }}>
                    {currentYear}
                </Text>
            </View>

            <FlatList
                ListHeaderComponent={() => {
                    return (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginVertical: 10,
                                backgroundColor: theme.secondary,
                                borderRadius: 100,
                                paddingVertical: 7,
                                alignItems: "center",
                            }}
                        >
                            {oneLetterDays.map((item, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        color: theme.primary,
                                        fontFamily: "Poppins-Light",
                                    }}
                                >
                                    {item}
                                </Text>
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
                style={{ flexGrow: 0 }}
                contentContainerStyle={{
                    justifyContent: "space-around",
                }}
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

const styles = StyleSheet.create({
    bigText: {
        fontSize: 34,
    },
});
