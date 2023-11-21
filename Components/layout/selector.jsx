import React, { useRef, useContext, useEffect, useState } from "react";
import { Animated, PanResponder, Dimensions, StyleSheet } from "react-native";
import FlatListRefContext from "../context/flatListContext";
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight || 0;

const windowHeight = Dimensions.get("window").height - statusBarHeight;
console.log(statusBarHeight, windowHeight)
const monthBoxHeight = (windowHeight) / 12;

const Selector = () => {
    const { currentMonth, selectNewMonth } =
        useContext(FlatListRefContext);


    const topPosition = useRef(new Animated.ValueXY({ y: (currentMonth - 1) * monthBoxHeight, x: 0 })).current;
    const scale = useRef(new Animated.Value(1)).current;



    let initialTop = 0;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
                initialTop = event.nativeEvent.pageY - topPosition.y._value;
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderMove: (event, gestureState) => {
                let newY = gestureState.moveY - initialTop;
                if (newY < 0) {
                    newY = 0;
                } else if (newY > monthBoxHeight * 11) {
                    newY = monthBoxHeight * 11;
                }
                topPosition.y.setValue(newY);
            },
            onPanResponderRelease: (event, gestureState) => {
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
                const newIndex = Math.round(topPosition.y._value / monthBoxHeight);
                Animated.timing(topPosition, {
                    toValue: { x: 0, y: newIndex * monthBoxHeight },
                    useNativeDriver: false,
                    duration: 200
                }).start();
                selectNewMonth(newIndex + 1);
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
        />
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
