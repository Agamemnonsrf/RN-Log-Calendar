import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";
import Layout from "./Components/layout/layout";
import { months } from "./Components/data/data";
import Day from "./Components/calendar/day";
import * as Font from "expo-font";

const fetchFonts = () => {
    return Font.loadAsync({
        Poppins: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    });
};

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(12);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [dataLoaded, setDataLoaded] = useState(false);

    const getDaysInMonth = (month, year) => {
        const days = new Date(year, month, 0).getDate();
        console.log();
        return days;
    };

    const getStartingDayOffset = (month, year) => {
        let startingDay = new Date(year, month - 1, 1).getDay() - 1; // Adjust for Monday (0-6)
        if (startingDay === -1) startingDay = 6; // Adjust Sunday to 6 (Saturday)
        return startingDay;
    };

    const getEndingDayOffset = (month, year) => {
        const daysInMonth = getDaysInMonth(month, year);
        let endingDay = new Date(year, month - 1, daysInMonth).getDay() - 1; // Adjust for Monday (0-6)
        if (endingDay === -1) endingDay = 6; // Adjust Sunday to 6 (Saturday)
        return endingDay;
    };

    const renderDays = () => {
        //make an array like currentMonthArray, but it is for January in the current year

        const currentMonthArray = Array.from(
            { length: getDaysInMonth(currentMonth, currentYear) },
            (_, i) => {
                return { day: i + 1, month: currentMonth };
            }
        );

        const decideMonth = (month) => {
            if (month === 0) {
                return 12;
            } else if (month === 13) {
                return 1;
            } else {
                return month;
            }
        };

        const decideMonthArray = (month) => {
            if (month === -1) {
                return 11;
            } else if (month === 12) {
                return 0;
            } else {
                return month;
            }
        };

        const currMonthAndBits = () => {
            const startOffset = getStartingDayOffset(currentMonth, currentYear);
            const endOffset = getEndingDayOffset(currentMonth, currentYear);

            const startMonth = Array.from({ length: startOffset }, (_, i) => {
                const yearOffset = currentMonth === 1 ? 1 : 0;
                const month = new Date(
                    currentYear - yearOffset,
                    currentMonth,
                    0
                );
                return {
                    day: getDaysInMonth(month.getMonth(), currentYear) - i,
                    month: decideMonth(currentMonth - 1),
                };
            }).reverse();

            const endMonth = Array.from({ length: endOffset }, (_, i) => {
                const month = new Date(currentYear, currentMonth, 1);
                return {
                    day: i + 1,
                    month: month.getMonth() + 1,
                };
            });

            return [...startMonth, ...currentMonthArray, ...endMonth];
        };

        return (
            <Pressable
                style={{
                    height: "100%",
                    flex: 1,
                    justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                <View>
                    <Text style={[styles.textDark, styles.bigText]}>
                        {months[decideMonthArray(currentMonth - 1)].fullName}
                    </Text>
                </View>
                <FlatList
                    renderItem={({ item }) => (
                        <Day
                            day={item.day}
                            isCurrentMonth={item.month === currentMonth}
                            month={item.month}
                        />
                    )}
                    data={currMonthAndBits()}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={7}
                    style={{
                        flexGrow: 0,
                    }}
                />
                <View></View>
            </Pressable>
        );
    };

    return (
        <View style={[styles.container, styles.backgroundDark]}>
            <Layout
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
            >
                {renderDays()}
            </Layout>
        </View>
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
        backgroundColor: "#22092C",
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
