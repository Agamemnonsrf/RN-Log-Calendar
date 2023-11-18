import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Day = ({ day, isCurrentMonth, month }) => {
    const isToday = () => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() + 1 === month &&
            today.getFullYear() === new Date().getFullYear()
        );
    };
    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: isCurrentMonth
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.3)",
                    backgroundColor: isToday() ? "#F05941" : "transparent",
                },
            ]}
        >
            <Text
                style={{
                    color: isCurrentMonth ? "white" : "rgba(255,255,255,0.8)",
                }}
            >
                {day}
            </Text>
            <Text
                style={{
                    color: isCurrentMonth ? "white" : "rgba(255,255,255,0.5)",
                }}
            >
                {month}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 38,
        height: 55,
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

export default Day;
