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
    KeyboardAvoidingView,
    Keyboard,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SyncedIcon from "./SyncedIcon";
import Spinner from "./Spinner";
import FlatListRefContext from "../context/flatListContext";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const textInputHeight = screenHeight * 0.4
const textinputWidth = screenWidth * 0.99

export default NoteInput = forwardRef(({ }, ref) => {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const { theme } = useContext(FlatListRefContext);

    const [date, setDate] = useState(new Date());
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(theme.antithesis);
    const [focused, setFocused] = useState(false);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem(date.toDateString());
            if (value !== null) {
                return value;
            } else return null;
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getData().then((value) => value && setText(value));
    }, []);

    const overlayHeight = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const focusPanRef = useRef(new Animated.Value(0)).current;
    const textPanRef = useRef(new Animated.Value(0)).current;

    const textInputPosition = useRef(new Animated.Value(0)).current;

    const focusTextInput = (dir) => {
        Animated.parallel([
            Animated.timing(textInputPosition, {
                toValue: dir,
                duration: 700,
                useNativeDriver: false,
            }),
        ]).start(() => {
            //setFocused(dir === 1 ? true : false);
        });
    };

    const setHasDataRef = useRef(null);
    const setColorRef = useRef(null);
    const textInputRef = useRef(null);

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
        setDate(new Date(year, month - 1, day));
        setText(data);
        setSelectedColor(color ? color : theme.antithesis);
    };

    useImperativeHandle(ref, () => ({
        showDropdown,
    }));

    const perf = (func) => {
        const t0 = performance.now();
        func();
        const t1 = performance.now();
        console.log(`Call to ${func.name} took ${t1 - t0}`);
    };

    const saveColor = async (date, color) => {
        try {
            await AsyncStorage.setItem(date.toDateString() + "color", color);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const hideDropdown = () => {
        textInputRef.current.blur();
        if (setHasDataRef.current) {
            setHasDataRef.current(text);
        }
        console.log("got here");
        if (setColorRef.current) {
            if (text.length > 0) {
                setColorRef.current(selectedColor);
                saveColor(date, selectedColor);
            } else {
                setColorRef.current("");
                saveColor(date, "");
            }
        }
    };

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
            } catch (e) { }
        }, 500)
    ).current;

    const handleTextChange = (text) => {
        setText(text);
        setLoading(true); // Set loading to true when text is changed
        debouncedSaveText(date, text); // Trigger debounced saveText function
    };

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

    const interpolatedHeight = overlayHeight.interpolate({
        inputRange: [0, 1],
        outputRange: ["100%", "100%"],
    });

    const interpolatedOpacity = overlayOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });
    const interpolateFocus = focusPanRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "60%"],
    });

    const interpolatedTextOffset = textPanRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <>

            <Pressable
                onPressIn={() => {
                    focusTextInput(1);
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                    }}
                >
                    <View
                        style={{
                            borderRadius: 100, paddingHorizontal: 5,
                            margin: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            top: 0,
                            zIndex: 11,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.primaryHighFade,
                                fontFamily: "Poppins-Medium",
                            }}
                        >
                            {date.toDateString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            zIndex: 6,
                            borderRadius: 100,
                            paddingHorizontal: 5,
                            margin: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            top: 0,
                        }}
                    >
                        {loading ? <Spinner /> : <SyncedIcon />}
                    </View>
                </View>
                <AnimatedTextInput
                    ref={textInputRef}
                    editable={focused}
                    multiline
                    numberOfLines={8}
                    maxLength={2000}
                    onChangeText={(text) => handleTextChange(text)}
                    value={text}
                    style={[
                        styles.textInput,
                        {
                            height: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [textInputHeight, screenHeight],
                            }),
                            width: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [textinputWidth, screenWidth],
                            }),
                            transform: [
                                {
                                    translateY: textInputPosition.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -100],
                                    }),

                                },
                            ],
                            backgroundColor: theme.quaternary,
                            color: theme.primary,
                            textAlignVertical: "top",
                            fontSize: 18,
                            shadowColor: "black",
                            shadowOffset: {
                                width: 3,
                                height: 2,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 3.84,
                            elevation: 5,
                        },
                    ]}
                    placeholder={focused ? "Your notes here..." : ""}
                    placeholderTextColor={theme.primaryHighFade}
                />
            </Pressable>
            {/* <AnimatedPressable
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 12,
                    backgroundColor: "black",
                    opacity: interpolatedOpacity,
                    height: interpolatedHeight,
                }}
                onPress={() => {
                    focusTextInput(0);
                    hideDropdown();
                }}
            /> */}
        </>
    );
});

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        paddingTop: 25,
        borderRadius: 5,
    },
});
