import React, { useEffect, useRef, useContext } from "react";
import { Animated } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";

export default SpinnerIcon = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const { theme } = useContext(FlatListRefContext);

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }], margin: 3 }}>
            <EvilIcons name="spinner-2" size={24} color={theme.primary} />
        </Animated.View>
    );
};
