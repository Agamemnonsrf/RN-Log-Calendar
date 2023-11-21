import React, {
    useState,
    useRef,
    useContext,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import {
    View,
    Pressable,
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";
import { months } from "../data/data";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;

const screenWidth = Dimensions.get("window").width;

export default Dropdown = forwardRef((props, ref) => {
    const [date, setDate] = useState(new Date());
    const [text, onChangeText] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const dropdownHeight = useRef(new Animated.Value(0)).current;
    const textOffset = useRef(new Animated.Value(1)).current;

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    const showDropdown = (year, month, day) => {
        setDate(new Date(year, month - 1, day));
    };

    useEffect(() => {
        Animated.sequence([
            Animated.timing(dropdownHeight, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(textOffset, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setDropdownVisible(true);
        });
    }, [date]);

    const hideDropdown = () => {
        setDropdownVisible(false);
    };

    useEffect(() => {
        if (!isDropdownVisible) {
            Animated.sequence([
                Animated.timing(textOffset, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(dropdownHeight, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isDropdownVisible]);

    useImperativeHandle(ref, () => ({
        showDropdown,
    }));

    const multipliedOffset = textOffset.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -screenWidth],
    });

    const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

    return (
        <>
            <AnimatedPressable
                style={[{ height: dropdownHeight }, styles.container]}
                onPress={hideDropdown}
            >
                <View
                    style={styles.subContainer}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                >
                    <View style={{ position: "relative", height: 50 }}>
                        <Animated.View
                            style={[
                                styles.textContainer,
                                {
                                    position: "absolute",
                                    left: multipliedOffset,
                                    top: 0,
                                },
                            ]}
                        >
                            <Text style={[styles.textDark, styles.textBig]}>
                                {date.getDate()} {months[date.getMonth()].name}{" "}
                                {date.getFullYear()} {isToday && "(Today)"}
                            </Text>
                        </Animated.View>
                    </View>
                </View>
            </AnimatedPressable>
            {isDropdownVisible && (
                <View style={styles.inputContainer}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={8}
                        maxLength={40}
                        onChangeText={(text) => onChangeText(text)}
                        value={text}
                        style={{
                            padding: 10,
                            backgroundColor: "#62666e",
                            borderRadius: 5,
                            textAlignVertical: "top",
                            color: "white",
                            fontSize: 18,
                        }}
                        placeholder="Your notes here..."
                        placeholderTextColor="white"
                    />
                </View>
            )}
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 5,
    },
    subContainer: { height: "50%", backgroundColor: "#2B303A" },
    textDark: { color: "white" },
    textBig: { fontSize: 25, fontWeight: "bold" },
    textContainer: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 10,
    },
    inputContainer: {
        padding: 10,
        zIndex: 6,
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
    },
});
