import React, { useRef, useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Animated,
    PanResponder,
    Dimensions,
    Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";

const windowHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;

export default YearSelector = ({ setCurrentYear, currentYear }) => {
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const textScale = useRef(new Animated.Value(1)).current;
    const { selectNewYear, theme } = useContext(FlatListRefContext);
    const AnimatedText = Animated.createAnimatedComponent(Text);

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const debounceSelectYear = useRef(
        debounce((yearSelected) => {
            selectNewYear(yearSelected);
        }, 1000)
    ).current;

    const handlePress = (direction) => {
        setSelectedYear((prevYear) => {
            debounceSelectYear(prevYear + direction);
            return prevYear + direction;
        });
    };

    useEffect(() => {
        Animated.sequence([
            Animated.timing(textScale, {
                toValue: 1.1,
                duration: 0,
                useNativeDriver: true,
            }),
            Animated.timing(textScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [selectedYear]);

    return (
        <Animated.View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 10,
                backgroundColor: theme.secondary,
                borderRadius: 10,
                padding: 5,
                height: windowHeight / 9,
            }}
        >
            <Pressable
                onPress={() => handlePress(-1)}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                }}
            >
                <AntDesign
                    name="caretleft"
                    size={20}
                    color={theme.primaryMidFade}
                />
            </Pressable>
            <AnimatedText
                style={{
                    fontSize: (windowHeight / 7) * 0.5,
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    color: theme.primary,
                    letterSpacing: 8,
                    transform: [{ scale: textScale }],
                }}
            >
                {selectedYear}
            </AnimatedText>
            <Pressable
                onPress={() => handlePress(+1)}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                }}
            >
                <AntDesign
                    name="caretright"
                    size={20}
                    color={theme.primaryMidFade}
                />
            </Pressable>
        </Animated.View>
    );
};
