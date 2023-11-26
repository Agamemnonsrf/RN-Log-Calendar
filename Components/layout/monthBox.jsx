import React, { useContext } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TouchableHighlight,
} from "react-native";
import FlatListRefContext from "../context/flatListContext";
import { gotoMonth } from "./selector";

export const MonthBox = ({ month }) => {
    const isTodayMonth = month.id === new Date().getMonth() + 1;

    const { selectNewMonth, theme } = useContext(FlatListRefContext);

    const handlePress = () => {
        selectNewMonth(month.id);
        gotoMonth(month.id);
    };

    return (
        <Pressable
            style={[
                styles.container,
                {
                    backgroundColor: isTodayMonth
                        ? theme.primaryHighFade
                        : "transparent",
                },
            ]}
            onPress={handlePress}
        >
            <Text
                style={{
                    color: theme.primary,
                    fontSize: 18,
                    backgroundColor: "transparent",
                    fontWeight: "bold",
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
        zIndex: 2,
    },
});
