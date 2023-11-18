import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { months } from "../data/data.js";
import Day from "./day.jsx";

const createDayRange = (days) => {
    const dayRange = [];
    for (let i = 1; i <= days; i++) {
        dayRange.push(i);
    }
    return dayRange;
};

export const Month = (props) => {
    const days = createDayRange(props.days);

    const cellRender = ({ item }) => {
        return (
            <View>
                <Day
                    //year={props.year}
                    day={item}
                    //month={props.month}
                    //monthKey={props.monthKey}
                    //stickerList={props.stickerList}
                    //db={props.db}
                />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.cellContainer}>
                <FlatList renderItem={cellRender} data={days} numColumns={7} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
    },
    cellContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
});
