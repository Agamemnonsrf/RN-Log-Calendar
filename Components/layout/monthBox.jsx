import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TouchableHighlight,
} from "react-native";

export const MonthBox = ({ month }) => {
    const isTodayMonth = month.id === new Date().getMonth() + 1;
    return (
        <Pressable
            style={[styles.container, { backgroundColor: isTodayMonth ? "rgba(255,255,255,0.5)" : "transparent" }]}
            underlayColor="#DDDDDD"
        >
            <Text
                style={{
                    color: "white",
                    fontSize: 18,
                    backgroundColor: "transparent",
                }}
            >
                {month.name}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 2,
    },
});
