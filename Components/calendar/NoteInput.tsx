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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const textInputHeight = screenHeight * 0.3
const textinputWidth = screenWidth * 0.90

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NoteInput = forwardRef(({ }, ref) => {
    const { theme } = useContext(FlatListRefContext);
    const randomnumber = Math.floor(Math.random() * 10);
    const [date, setDate] = useState(new Date());
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [focused, setFocused] = useState(false);
    const [animationPlaying, setAnimationPlaying] = useState(false);
    const [closeAnimationPlaying, setCloseAnimationPlaying] = useState(false)
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

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
        setSelectedColor(color ? color : "");
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
                    //console.log("setting and saving color to " + selectedColor)
                    //saveColor(date, selectedColor);
                } else {
                    //setColorRef.current("");
                    //saveColor(date, "");
                }
            }
        }
    };

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout | undefined;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const debouncedSaveText = useRef(
        debounce(async (date: Date, text: string) => {
            try {
                await AsyncStorage.setItem(date.toDateString(), text);
                setLoading(false); // Set loading to false after saving is complete
            } catch (e) {
                console.log(e);
            }
        }, 500)
    ).current;

    const handleTextChange = (text: string) => {
        setText(text);
        setLoading(true); // Set loading to true when text is changed
        debouncedSaveText(date, text);
    }



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
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: theme.quaternary,
                    borderBottomColor: textInputPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["transparent", theme.primaryHighFade],
                    }),
                    borderBottomWidth: 1,
                    width: textInputPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [textinputWidth, screenWidth],
                    }),
                    position: "absolute",
                    top: 0,
                    zIndex: 20,
                    height: textInputPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 70],
                    }),
                    borderRadius: 5
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 10
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
                            paddingHorizontal: 5,
                            marginRight: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-40, 10],
                            }),
                            justifyContent: "center",
                            alignItems: "center",
                            top: 0,
                        }}
                    >
                        {loading ? <Spinner /> : <SyncedIcon />}
                    </Animated.View>
                </View>
                <AnimatedPressable
                    onPress={() => {
                        setCloseAnimationPlaying(true);
                    }}
                    style={{
                        flex: 1,
                        paddingHorizontal: 5,
                        margin: 2.5,
                        marginTop: 6,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                        zIndex: 11,
                        right: 0,
                        opacity: textInputPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    }}>
                    <Octicons name="arrow-down" size={28} color={theme.primaryHighFade} />
                </AnimatedPressable>
            </Animated.View>
            <KeyboardAwareScrollView
                style={{ flex: 1, height: "50%" }}
                enableAutomaticScroll={false}
                onScroll={() => {
                    setIsScrolling(true);
                }}>
                <AnimatedTextInput
                    ref={textInputRef}
                    editable={focused && ((!isScrolling || (textInputRef.current && textInputRef.current.isFocused())) || false)}
                    multiline
                    numberOfLines={8}
                    maxLength={2000}
                    onChangeText={handleTextChange}
                    value={text}
                    style={[
                        styles.textInput,
                        {
                            height: "200%",
                            maxHeight: 200,
                            width: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [textinputWidth, screenWidth],
                            }),
                            paddingTop: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [40, 75],
                            }),
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
                            paddingBottom: textInputPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 620],
                            }),
                            shadowOpacity: 1,
                            shadowRadius: 3.84,
                            elevation: 5,
                        },
                    ]}
                    scrollEnabled={false}
                    placeholder={"Your notes here..."}
                    placeholderTextColor={theme.primaryHighFade}
                    onPressIn={() => setIsScrolling(false)}
                />
            </KeyboardAwareScrollView>
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
