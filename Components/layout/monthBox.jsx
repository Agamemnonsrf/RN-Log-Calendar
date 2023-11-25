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

    const { selectNewMonth } = useContext(FlatListRefContext);

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
                        ? "rgba(255,255,255,0.5)"
                        : "transparent",
                },
            ]}
            onPress={handlePress}
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
        zIndex: 2,
    },
});
