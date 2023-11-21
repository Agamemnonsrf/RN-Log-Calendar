import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

export const Day = ({ day, isCurrentMonth, month, isToday }) => {

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: isCurrentMonth
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.3)",
                    backgroundColor: isToday ? "#F05941" : "transparent",
                },
            ]}
        >
            <Text
                style={{
                    color: isCurrentMonth ? "white" : "rgba(255,255,255,0.8)",
                    padding: 2
                }}
            >
                {day}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 38,
        height: 60,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginHorizontal: 1,
        marginVertical: 2,
    },
    text: {
        position: "absolute",
        top: 5,
        left: 5,
    },
});

export default memo(Day);
