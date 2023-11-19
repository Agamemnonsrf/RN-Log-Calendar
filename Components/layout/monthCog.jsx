import React, { useRef, useState } from "react";
import { Animated, PanResponder, View, StyleSheet } from "react-native";
import { months } from "../data/data.js";
import { MonthBox } from "./monthBox.jsx";

const MonthCog = ({ setCurrentMonth }) => {
    const monthBoxHeight = 50;
    const dragY = useRef(new Animated.Value(0)).current;
    const offsetY = useRef(0);
    const [monthIndex, setMonthIndex] = useState(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                dragY.setOffset(offsetY.current);
                dragY.setValue(0);
            },
            onPanResponderMove: (evt, gestureState) => {
                dragY.setValue(gestureState.dy);
                setMonthIndex(
                    Math.floor(
                        (offsetY.current + gestureState.dy) / monthBoxHeight +
                            months.length
                    ) % months.length
                );
            },
            onPanResponderRelease: () => {
                offsetY.current += dragY._value;
                dragY.flattenOffset();
                setMonthIndex(
                    Math.floor(
                        offsetY.current / monthBoxHeight + months.length
                    ) % months.length
                );
            },
        })
    ).current;

    return (
        <View style={styles.monthsContainer} {...panResponder.panHandlers}>
            {Array.from({ length: months.length }, (_, i) => i).map((_, i) => {
                const translateY = Animated.add(dragY, i * monthBoxHeight);
                const scale = dragY.interpolate({
                    inputRange: [
                        (i - 1) * monthBoxHeight,
                        i * monthBoxHeight,
                        (i + 1) * monthBoxHeight,
                    ],
                    outputRange: [0.8, 1, 0.8],
                    extrapolate: "clamp",
                });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            transform: [{ translateY }, { scale }],
                        }}
                    >
                        <MonthBox
                            month={months[(monthIndex + i) % months.length]}
                            setCurrentMonth={setCurrentMonth}
                        />
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
    },
    selector: {
        flex: 1,
        height: "8.33%",

        position: "absolute",
        zIndex: 3,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    appSquare: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "white",
    },
    yearBar: {
        flex: 5,
        justifyContent: "center",
    },
    sidebar: {
        flex: 1,
        flexDirection: "row",
    },
    content: {
        flex: 1,
        flexDirection: "column",
        borderRightWidth: 1,
        borderRightColor: "white",
    },
    topBar: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "white",
        flexDirection: "row",
    },
    monthsContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",

        position: "relative",
    },
    childrenContainer: {},
    text: {
        color: "white",
        margin: 5,
    },
});

export default MonthCog;
