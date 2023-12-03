import React, {
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import { View, Animated, Pressable } from "react-native";

const Overlay = ({ setFocused, focused, perf }, ref) => {
    const overlayHeight = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    useEffect(() => {
        if (focused) {
            showOverlay();
        } else {
            hideOverlay();
        }
    }, [focused]);

    const showOverlay = () => {
        Animated.parallel([
            Animated.timing(overlayHeight, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const hideOverlay = () => {
        Animated.parallel([
            Animated.spring(overlayHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.spring(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const interpolatedHeight = overlayHeight.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const interpolatedOpacity = overlayOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    return (
        <AnimatedPressable
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: "black",
                opacity: interpolatedOpacity,
                height: interpolatedHeight,
            }}
            onPress={() => setFocused(false)}
        />
    );
};

export default Overlay;
