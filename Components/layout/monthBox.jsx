import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TouchableHighlight,
} from "react-native";

export const MonthBox = ({ month, setCurrentMonth }) => {
    return (
        <Pressable
            style={[styles.container]}
            onPressIn={() => setCurrentMonth(month.id)}
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
