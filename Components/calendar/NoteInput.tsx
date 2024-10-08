import React, {
    useState,
    useRef,
    useContext,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useCallback,
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
    StatusBar,
    Easing,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SyncedIcon from "./SyncedIcon";
import Spinner from "./Spinner";
import FlatListRefContext from "../context/flatListContext";
import { Octicons } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const textInputHeight = screenHeight * 0.3
const textinputWidth = screenWidth * 0.90

const NoteInput = forwardRef(({ }, ref) => {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const { theme } = useContext(FlatListRefContext);
    const randomnumber = Math.floor(Math.random() * 10);
    console.log("rerendering" + randomnumber)
    const [date, setDate] = useState(new Date());
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(theme.antithesis);
    const [focused, setFocused] = useState(false);
    const [animationPlaying, setAnimationPlaying] = useState(false);
    const [closeAnimationPlaying, setCloseAnimationPlaying] = useState(false)

    useEffect(() => {
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

        getData().then((value) => value && setText(value));
    }, []);

    const textInputPosition = useRef(new Animated.Value(0)).current;

    const focusTextInput = (dir: number) => {
        Animated.parallel([
            Animated.spring(textInputPosition, {
                toValue: dir,
                friction: 9,
                tension: 35,
                useNativeDriver: false,
            }),

        ]).start(() => {
            Keyboard.dismiss(),
                setAnimationPlaying(false);
            setCloseAnimationPlaying(false)
            console.log(dir)
            setFocused(dir === 1 ? true : false)
            if (dir === 0)
                hideDropdown();
        });
    };

    useEffect(() => {
        if (animationPlaying) {
            focusTextInput(1);
        }
    }, [animationPlaying]);

    useEffect(() => {
        if (closeAnimationPlaying) {
            focusTextInput(0);
        }
        console.log("unfocusing")
    }, [closeAnimationPlaying]);

    const setHasDataRef = useRef
        <((data: string) => void) | null>(null);
    (null);
    const setColorRef = useRef
        <((color: string) => void) | null>(null);
    (null);
    const textInputRef = useRef<TextInput | null>(null);

    const showDropdown = (
        year: number,
        month: number,
        day: number,
        data: string,
        setHasData: (data: string) => void,
        setColor: (color: string) => void,
        color: string
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

    const saveColor = async (date: Date, color: string) => {
        try {
            await AsyncStorage.setItem(date.toDateString() + "color", color);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const hideDropdown = () => {
        if (textInputRef.current) {
            textInputRef.current.blur();
            if (setHasDataRef.current) {
                setHasDataRef.current(text);
            }
            if (setColorRef.current) {
                if (text.length > 0) {
                    setColorRef.current(selectedColor);
                    saveColor(date, selectedColor);
                } else {
                    setColorRef.current("");
                    saveColor(date, "");
                }
            }
        }
    };

    // const debounce = (func, delay) => {
    //     let timeoutId;
    //     return function (...args) {
    //         clearTimeout(timeoutId);
    //         timeoutId = setTimeout(() => func.apply(this, args), delay);
    //     };
    // };

    // const debouncedSaveText = useRef(
    //     debounce(async (date, text) => {
    //         try {
    //             await AsyncStorage.setItem(date.toDateString(), text);
    //             setLoading(false); // Set loading to false after saving is complete
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }, 500)
    // ).current;

    const handleTextChange = (text: string) => {
        setText(text);
        //setLoading(true); // Set loading to true when text is changed
        //debouncedSaveText(date, text);
    }

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

    return (
        <AnimatedPressable
            onPressOut={() => {
                console.log("pressed")
                if (!animationPlaying)
                    setAnimationPlaying(true);
            }}
            style={{
                marginBottom: textInputPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                }),
                opacity: textInputPosition.interpolate({
                    inputRange: [0, 0.4, 0.99, 1],
                    outputRange: [1, 0, 0.5, 1],
                }),
                height: textInputPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["85%", "153%"],
                }),
            }}
        >
            <Animated.View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: textInputPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [textinputWidth, screenWidth],
                    }),
                    position: "absolute",
                    top: 0,
                    zIndex: 20,
                }}
            >
                <Animated.View
                    style={{
                        borderRadius: 100,
                        paddingHorizontal: 5,
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
                </Animated.View>
                <Animated.View
                    style={{
                        zIndex: 11,
                        borderRadius: 100,
                        paddingHorizontal: 5,
                        marginRight: textInputPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 50],
                        }),
                        margin: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                    }}
                >
                    {loading ? <Spinner /> : <SyncedIcon />}
                </Animated.View>
                <AnimatedPressable
                    onPress={() => {
                        setCloseAnimationPlaying(true);
                    }}
                    style={{
                        borderRadius: 100,
                        paddingHorizontal: 5,
                        margin: 2.5,
                        marginTop: 6,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                        zIndex: 11,
                        position: "absolute",
                        right: 0,
                        opacity: textInputPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    }}>
                    <Octicons name="arrow-down" size={28} color={theme.primaryHighFade} />
                </AnimatedPressable>
            </Animated.View>
            <AnimatedTextInput
                ref={textInputRef}
                editable={focused}
                multiline
                numberOfLines={8}
                maxLength={2000}
                onChangeText={handleTextChange}
                value={text}
                style={[
                    styles.textInput,
                    {
                        height: "100%",
                        width: textInputPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [textinputWidth, screenWidth],
                        }),
                        transform: [
                            {
                                translateY: textInputPosition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0],
                                }),
                            },
                        ],
                        paddingTop: 30,
                        zIndex: 10,
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
                placeholder={"Your notes here..."}
                placeholderTextColor={theme.primaryHighFade}
                onFocus={() => {
                    if (textInputRef.current)
                        textInputRef.current.focus();
                }}
            />
        </AnimatedPressable>
    );
});

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        borderRadius: 5,
        fontFamily: "Poppins-Light",
    },
});

export default NoteInput;
