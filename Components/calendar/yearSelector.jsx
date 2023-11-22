import React, { useRef, useEffect } from "react";
import { View, Text, Animated, PanResponder } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default YearSelector = ({ setCurrentYear, currentYear }) => {
    useEffect(() => {
        pan.setValue({ x: 0, y: 0 });
    }, [currentYear]);


    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },

            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                    duration: 1000,
                }).start();
                if (pan.x._value > 150) {
                    setCurrentYear((prevYear) => prevYear + 1);
                } else if (pan.x._value < -150) {
                    setCurrentYear((prevYear) => prevYear - 1);
                }
            },
        })
    ).current;


    return (
        <Animated.View
            style={{
                transform: [{ translateX: pan.x }], justifyContent: "center",
                alignItems: "center", flexDirection: "row", marginBottom: 40,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: 5,
                height: 100,
            }}
            {...panResponder.panHandlers}
        >
            <View style={{ justifyContent: "center", alignItems: "center" }}><AntDesign name="caretleft" size={20} color="rgba(255,255,255,0.6)" /></View>
            <Text
                style={{
                    fontSize: 60,
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    color: "white",
                    letterSpacing: 8,
                }}
            >
                {currentYear}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}><AntDesign name="caretright" size={20} color="rgba(255,255,255,0.6)" /></View>
        </Animated.View>
    )
}