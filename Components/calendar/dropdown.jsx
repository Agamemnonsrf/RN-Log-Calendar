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
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    BackHandler,
    PanResponder,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { months } from "../data/data";
import SyncedIcon from "./SyncedIcon";
import Spinner from "./Spinner";
import FlatListRefContext from "../context/flatListContext";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;

const screenWidth = Dimensions.get("window").width;

const colors = [
    "rgba(44, 62, 80, 0.4)", // Wet Asphalt
    "rgba(52, 73, 94, 0.4)", // Midnight Blue
    "rgba(41, 128, 185, 0.4)", // Belize Hole
    "rgba(22, 160, 133, 0.4)", // Green Sea
    "rgba(243, 156, 18, 0.4)", // Orange
    "rgba(211, 84, 0, 0.4)", // Pumpkin
    "rgba(189, 195, 199, 0.4)", // Clouds
    "rgba(127, 140, 141, 0.4)", // Asbestos
    "rgba(155, 89, 182, 0.4)", // Amethyst
    "rgba(241, 196, 15, 0.4)", // Sunflower
    "rgba(230, 126, 34, 0.4)", // Carrot
    "rgba(231, 76, 60, 0.4)", // Alizarin
    "rgba(210, 105, 30, 0.4)", // Chocolate
    "rgba(112, 128, 144, 0.4)", // SlateGray
    "rgba(70, 130, 180, 0.4)", // SteelBlue
    "rgba(0, 206, 209, 0.4)", // DarkTurquoise
    "rgba(60, 179, 113, 0.4)", // MediumSeaGreen
    "rgba(189, 183, 107, 0.4)", // DarkKhaki
    "rgba(255, 215, 0, 0.4)", // Gold
    "rgba(218, 165, 32, 0.4)", // GoldenRod
    "rgba(205, 133, 63, 0.4)", // Peru
    "rgba(210, 180, 140, 0.4)", // Tan
    "rgba(188, 143, 143, 0.4)", // RosyBrown
    "rgba(255, 99, 71, 0.4)", // Tomato
];

export default Dropdown = forwardRef((_, ref) => {
    const [date, setDate] = useState(new Date());
    const [text, onChangeText] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const { theme } = useContext(FlatListRefContext);
    const dropdownHeight = useRef(new Animated.Value(0)).current;
    const textOffset = useRef(new Animated.Value(1)).current;
    const initialRender = useRef(true);
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const panRef = useRef(new Animated.Value(0)).current;

    //panResponder for panning the dropdown with the bottombar
    // In the Dropdown component
    const subContainerHeight = useRef(new Animated.Value(0)).current;
    const textInputHeight = 200;
    const initialSubContainerHeight = 350;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
                Animated.timing(panRef, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderMove: (e, gestureState) => {
                // Calculate new height based on gesture movement
                let newHeight = gestureState.dy + subContainerHeight._value;
                // Ensure new height is within valid range
                newHeight = Math.max(initialSubContainerHeight, newHeight);
                newHeight = Math.min(screenHeight, newHeight);
                // Set new height
                subContainerHeight.setValue(newHeight);
            },
            onPanResponderRelease: (e, gestureState) => {
                Animated.timing(panRef, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    const borderTopColor = panRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["grey", "lightgrey"],
    });

    const handleSelectColor = (color) => {
        let finalColor = color;
        if (finalColor === selectedColor) finalColor = "";
        else finalColor = color;

        setLoading(true);
        saveColor(date, finalColor).then(() => setSelectedColor(finalColor));
    };

    const saveColor = async (date, color) => {
        try {
            await AsyncStorage.setItem(date.toDateString() + "color", color);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };
    const setHasDataRef = useRef(null);
    const setColorRef = useRef(null);
    const showDropdown = (
        year,
        month,
        day,
        data,
        setHasData,
        setColor,
        color
    ) => {
        setHasDataRef.current = setHasData;
        setColorRef.current = setColor;
        setSelectedColor(color);
        setDate(new Date(year, month - 1, day));
        onChangeText(data);
    };
    const hideDropdown = () => {
        if (setHasDataRef.current) {
            setHasDataRef.current(text);
        }
        if (setColorRef.current) {
            setColorRef.current(selectedColor);
        }
        setDropdownVisible(false);
    };
    const backAction = () => {
        hideDropdown();
        return true; // This will stop the event from bubbling up and closing the app.
    };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            backHandler.remove();
        };
    }, [text, selectedColor]);

    useEffect(() => {}, [isDropdownVisible]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        } else {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(subContainerHeight, {
                        toValue: initialSubContainerHeight,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                    Animated.timing(dropdownHeight, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.timing(textOffset, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setDropdownVisible(true);
            });
        }
    }, [date]);

    useEffect(() => {
        if (!isDropdownVisible) {
            Animated.sequence([
                Animated.timing(textOffset, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.parallel([
                    Animated.timing(dropdownHeight, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                    Animated.timing(subContainerHeight, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                ]),
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

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const debouncedSaveText = useRef(
        debounce(async (date, text) => {
            try {
                await AsyncStorage.setItem(date.toDateString(), text);
                setLoading(false); // Set loading to false after saving is complete
            } catch (e) {}
        }, 500)
    ).current;

    const handleTextChange = (text) => {
        onChangeText(text);
        setLoading(true); // Set loading to true when text is changed
        debouncedSaveText(date, text); // Trigger debounced saveText function
    };

    return (
        <>
            <AnimatedPressable
                style={[{ height: dropdownHeight }, styles.container]}
                onPress={hideDropdown}
            >
                <Animated.View
                    style={[
                        styles.subContainer,
                        {
                            height: subContainerHeight,
                            backgroundColor: theme.background,
                        },
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    <View style={{ position: "relative" }}>
                        <Animated.View
                            style={[
                                styles.textContainer,
                                {
                                    left: multipliedOffset,
                                    backgroundColor: theme.secondary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    { color: theme.primary },
                                    styles.textBig,
                                ]}
                            >
                                {date.getDate()} {months[date.getMonth()].name}{" "}
                                {date.getFullYear()} {isToday && "(Today)"}
                            </Text>
                        </Animated.View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            position: "absolute",
                            bottom: 25,
                        }}
                    >
                        {colors.map((color, index) => (
                            <Pressable
                                key={index}
                                style={{
                                    backgroundColor: color,
                                    height: screenWidth / 6 - 10,
                                    width: screenWidth / 6 - 10,
                                    margin: 5,
                                    borderRadius: 5,
                                    borderWidth:
                                        selectedColor === color ? 2 : 0,
                                    borderColor: theme.primary,
                                }}
                                onPress={() => handleSelectColor(color)}
                            />
                        ))}
                    </View>
                    <Animated.View
                        style={[
                            styles.bottomBar,
                            {
                                height: 25,
                                left: multipliedOffset,
                                backgroundColor: theme.quaternary,
                            },
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <Animated.View
                            style={{
                                borderTopWidth: 2,
                                borderTopColor: borderTopColor,
                                width: "50%",
                            }}
                        />
                    </Animated.View>
                </Animated.View>
            </AnimatedPressable>

            <Animated.View
                style={[
                    styles.inputContainer,
                    { left: multipliedOffset, width: "100%" },
                ]}
            >
                <View style={{ alignItems: "flex-end", height: 30 }}>
                    {loading ? <Spinner /> : <SyncedIcon />}
                </View>
                <TextInput
                    editable
                    multiline
                    numberOfLines={8}
                    maxLength={2000}
                    onChangeText={(text) => handleTextChange(text)}
                    value={text}
                    style={[
                        styles.textInput,
                        {
                            height: textInputHeight,
                            backgroundColor: theme.tertiary,
                            color: theme.primary,
                        },
                    ]}
                    placeholder="Your notes here..."
                    placeholderTextColor={theme.primaryHighFade}
                />
            </Animated.View>
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
    subContainer: {
        position: "relative",
    },
    textBig: { fontSize: 25, fontWeight: "bold" },
    textContainer: {
        padding: 10,
        position: "absolute",
        top: 0,
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginLeft: 10,
    },
    textInput: {
        padding: 10,
        borderRadius: 5,
        textAlignVertical: "top",
        fontSize: 18,
    },
    inputContainer: {
        padding: 10,
        zIndex: 6,
        position: "absolute",
        top: 50,
        right: 0,
    },
    bottomBar: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 10,
    },
});
