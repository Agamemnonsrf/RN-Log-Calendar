import React, { useRef, useContext, useEffect, useState } from "react";
import { Animated, PanResponder, Dimensions, StyleSheet } from "react-native";
import FlatListRefContext from "../context/flatListContext";

const windowHeight = Dimensions.get("window").height;
const monthBoxHeight = (windowHeight - 50) / 12;

const Selector = () => {
    const previousPosition = useRef(0);
    const currAction = useRef("");

    const topPosition = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const { flatListRef, setMonthsLoaded, monthsLoaded } =
        useContext(FlatListRefContext);

    useEffect(() => {
        if (monthsLoaded?.length > 1) {
            if (currAction.current === "up") {
                flatListRef.current.scrollToOffset({
                    offset: windowHeight,
                    animated: true,
                });
                setTimeout(() => {
                    setMonthsLoaded((prev) => {
                        return [prev[prev.length - 1]];
                    });
                }, 1000);
            } else if (currAction.current === "down") {
                flatListRef.current.scrollToIndex({
                    index: 0,
                    animated: true,
                });
                setTimeout(() => {
                    setMonthsLoaded((prev) => {
                        return [prev[0]];
                    });
                }, 1500);
            }
        }
    }, [monthsLoaded]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
                topPosition.setOffset({
                    x: topPosition.x._value,
                    y: topPosition.y._value,
                });
                topPosition.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: topPosition.x, dy: topPosition.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
                topPosition.flattenOffset();
                const newIndex = Math.round(
                    topPosition.y._value / monthBoxHeight
                );

                Animated.spring(topPosition, {
                    toValue: { x: 0, y: newIndex * monthBoxHeight },
                    useNativeDriver: false,
                }).start();
                if (previousPosition.current < newIndex) {
                    currAction.current = "up";
                    setTimeout(() => {
                        setMonthsLoaded((prev) => [...prev, newIndex + 1]);
                    }, 100);
                } else if (previousPosition.current > newIndex) {
                    currAction.current = "down";
                    setTimeout(() => {
                        setMonthsLoaded((prev) => [newIndex + 1, ...prev]);
                    }, 100);
                }
                previousPosition.current = newIndex;
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.selector,
                topPosition.getLayout(),
                { left: 0, transform: [{ scale: scale }] },
            ]}
        ></Animated.View>
    );
};

const styles = StyleSheet.create({
    selector: {
        flex: 1,
        height: "8.33%",

        position: "absolute",
        zIndex: 3,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
});

export default Selector;
