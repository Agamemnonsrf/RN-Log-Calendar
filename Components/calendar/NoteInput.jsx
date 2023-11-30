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

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const screenWidth = Dimensions.get("window").width;

export default NoteInput = forwardRef(({ focused, setFocused }, ref) => {
    const [date, setDate] = useState(new Date());
    const [text, onChangeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { theme } = useContext(FlatListRefContext);

    const [selectedColor, setSelectedColor] = useState(theme.antithesis);

    const panRef = useRef(new Animated.Value(1)).current;

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
        textInputRef.current.focus();
        setDate(new Date(year, month - 1, day));
        onChangeText(data);
        setSelectedColor(color);
        setFocused(true);
    };

    useImperativeHandle(ref, () => ({
        showDropdown,
    }));

    useEffect(() => {
        Animated.spring(panRef, {
            toValue: focused ? 1 : 0,
            useNativeDriver: false,
        }).start();
    }, [focused]);

    const hideDelay = (delay) => {
        setTimeout(() => {
            hideDropdown();
        }, delay);
    };

    const hideDropdown = () => {
        setFocused(false);
        textInputRef.current.blur();
        if (setHasDataRef.current) {
            setHasDataRef.current(text);
        }
        if (setColorRef.current) {
            if (text.length > 0) {
                if (!selectedColor.length > 0) {
                    console.log("no color");
                    setColorRef.current(theme.antithesis);
                } else {
                    console.log("color");
                    setColorRef.current(selectedColor);
                }
            } else {
                console.log("no text");
                setColorRef.current("");
            }
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                hideDropdown();
                setKeyboardHeight(0); // Reset keyboard height when it hides
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

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
        onChangeText(text);
        setLoading(true); // Set loading to true when text is changed
        debouncedSaveText(date, text); // Trigger debounced saveText function
    };

    const interpolatePanX = panRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["-500%", "0%"],
    });

    const interpolatePanY = panRef.interpolate({
        inputRange: [0, 1],
        outputRange: [10, keyboardHeight],
    });

    return (
        <Animated.View
            style={[
                styles.inputContainer,
                {
                    width: "95%",
                    backgroundColor: "transparent",
                    position: "absolute",
                    alignSelf: "center",
                    bottom: 0,
                    marginBottom: 60
                },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Animated.View
                    style={{
                        zIndex: 6,
                        backgroundColor: theme.primary,
                        borderRadius: 100,
                        paddingHorizontal: 5,
                        margin: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                        left: interpolatePanX,
                    }}
                >
                    <Text
                        style={{
                            color: theme.background,
                            fontFamily: "Poppins-Medium",
                        }}
                    >
                        {date.toDateString()}
                    </Text>
                </Animated.View>
                <Animated.View
                    style={{
                        zIndex: 6,
                        backgroundColor: theme.primary,
                        borderRadius: 100,
                        paddingHorizontal: 5,
                        margin: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                        right: interpolatePanX,
                    }}
                >
                    {loading ? <Spinner /> : <SyncedIcon />}
                </Animated.View>
            </View>
            <TextInput
                ref={textInputRef}
                editable
                multiline
                numberOfLines={8}
                maxLength={2000}
                onChangeText={(text) => handleTextChange(text)}
                value={text}
                style={[
                    styles.textInput,
                    {
                        height: "100%",
                        width: "100%",
                        backgroundColor: focused
                            ? theme.tertiary
                            : theme.quaternary,
                        color: theme.primary,
                        textAlignVertical: "top",
                        alignSelf: "center",
                        fontSize: 18,
                    },
                ]}
                placeholder={focused ? "Your notes here..." : ""}
                placeholderTextColor={theme.primaryHighFade}
                onFocus={() => {
                    setFocused(true);
                }
                }
                onBlur={() => {
                    setFocused(false);
                }}
            />
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        borderRadius: 5,
    },
    inputContainer: {
        zIndex: 6,
    },
});
