import React, { useEffect, useRef, useContext } from "react";
import { Animated } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";
import { ActivityIndicator, View } from "react-native-web";

export default SpinnerIcon = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const { theme } = useContext(FlatListRefContext);
    const AnimatedEvilIcons = Animated.createAnimatedComponent(EvilIcons)

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
        <Animated.View
            style={{
                transform: [{ rotate: spin }],
                // transformOrigin: [20, 20, 20],
                // borderWidth: 2,
                // borderColor: 'green',
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {/* <Animated.View style={{ position: "absolute", width: 2, height: 2, backgroundColor: "red" }} /> */}
            <EvilIcons
                name="spinner-2"
                size={24}
                color={theme.primaryHighFade}
                style={{
                    // borderWidth: 2,
                    // borderColor: 'red',
                    paddingLeft: 0,
                    paddingBottom: 5,
                    paddingTop: 0,
                }}
            />
        </Animated.View>
    );
};
