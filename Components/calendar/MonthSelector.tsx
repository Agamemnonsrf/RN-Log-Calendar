import React, { useEffect, useRef, useContext, memo, useState, forwardRef, useImperativeHandle } from "react";
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
    PanResponder,
    Pressable, StatusBar as RNStatusBar
} from "react-native";
import Day from "./day";
import YearSelector from "./yearSelector";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";
import { render } from "react-dom";

const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const screenWidth = Dimensions.get("window").width;

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


type MonthSelectorProps = {
    currentMonth: number;
    selectNewMonth: (month: number) => void;
};

const MonthSelector = forwardRef(({
    currentMonth,
    selectNewMonth,
}: MonthSelectorProps, ref) => {
    const { theme } = useContext(FlatListRefContext);
    const heightRef = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList | null>(null);
    const prevMonthRef = useRef(currentMonth);
    const [showingMenu, setShowingMenu] = useState({ state: false, month: 0 });
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    const interpolatedHeight = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 200],
    });

    useImperativeHandle(ref, () => ({
        scrollToCurr
    }));

    const scrollToCurr = () => {
        flatListRef.current && flatListRef.current.scrollToIndex({
            index: ((new Date().getMonth() + 1) - 1) + 12 * 500,
            animated: true,
        });
    };

    const interpolatedBackgroundColor = heightRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(50, 50, 50, 0.6)", "rgba(50, 50, 50, 1)"],
    });

    const renderItem = (item: number, index: number) => {

        return (
            <AnimatedPressable
                onPress={() => {
                    setShowingMenu((prev) => {
                        prevMonthRef.current = index;
                        return { state: !prev.state, month: item, index };
                    });
                }}
                style={{
                    width: "100%",
                    paddingHorizontal: 6,
                    alignItems: "center",
                    height: 50,
                    //TODO: maybe add some extra margin to january and december
                    marginBottom: 10,
                    backgroundColor: (index % 12) + 1 === currentMonth ? heightRef.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["transparent", theme.secondary],
                    }) : 'transparent',
                    borderRadius: 10,
                }}
            >
                <Text
                    style={[
                        {
                            color: theme.primary,
                            //TODO: set the font to big if it is the current month, doesn't work
                            fontFamily: item === currentMonth
                                ? "Poppins-Black" : "Poppins-Light",
                            fontSize: 34,
                        },
                    ]}
                >
                    {item}
                </Text>
            </AnimatedPressable>
        );
    };

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            if (showingMenu.state) {
                showMenu(showingMenu.month);
            } else {
                hideMenu(showingMenu.month);
            }
        }
    }, [showingMenu]);

    const showMenu = (month: number) => {
        if (flatListRef.current) {
            Animated.parallel([Animated.spring(heightRef, {
                toValue: 1,
                useNativeDriver: false,
            }),
            flatListRef.current.scrollToIndex({
                index: month - 1,
                animated: true,
            }) as unknown as Animated.CompositeAnimation
            ])
        }
    };

    const hideMenu = (month: number) => {
        console.log(month)
        if (flatListRef.current) {
            Animated.parallel([
                Animated.spring(heightRef, {
                    toValue: 0,
                    useNativeDriver: false,
                }),
                flatListRef.current.scrollToIndex({
                    index: month,
                    animated: true,
                }) as unknown as Animated.CompositeAnimation,
            ]).start();
            setTimeout(() => {
                selectNewMonth(month % 12 + 1);
            }, 300)
        }
    };

    return (
        <Animated.View
            style={{
                height: interpolatedHeight,
                backgroundColor: interpolatedBackgroundColor,
                borderRadius: 10,
                zIndex: 1,
                paddingHorizontal: 10,
                overflow: 'visible'
            }}
        >
            <FlatList
                scrollEnabled={showingMenu.state}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => {
                    return { length: 60, offset: 60 * index, index };
                }}
                data={Array(1000).fill(months).flat()}
                keyExtractor={(item, index) => item + index}
                contentContainerStyle={{}}
                initialScrollIndex={(currentMonth - 1) + 12 * 500}
                renderItem={({ item, index }) => renderItem(item, index)}
                ListFooterComponent={() => {
                    return <View style={{ height: 100 }} />;
                }}
            />
        </Animated.View>
    );
})
{
    /* {new Date(
                        Date.UTC(currentYear, decideMonthForArray(currentMonth))
                    ).toLocaleDateString(undefined, { month: "long" })} */
}
export default MonthSelector