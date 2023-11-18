import React from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";
import { months } from "../data/data.js";
import { MonthBox } from "./monthBox.jsx";

const Layout = ({ children, currentMonth, setCurrentMonth }) => {
    const topPosition = React.useRef(
        new Animated.Value(currentMonth * 50 - 50)
    ).current;

    // Animate the change of the top property
    React.useEffect(() => {
        Animated.timing(topPosition, {
            toValue: currentMonth * 50 - 50,
            duration: 500, // duration of the animation, in milliseconds
            useNativeDriver: false, // change to true if you're animating opacity or transform
            easing: Easing.inOut(Easing.ease),
        }).start();
    }, [currentMonth]);
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.appSquare}></View>
                <View style={styles.yearBar}>
                    <Text style={[styles.text, { fontSize: 34 }]}>2023</Text>
                </View>
            </View>
            <View style={styles.sidebar}>
                <View style={styles.monthsContainer}>
                    {months.map((month) => (
                        <MonthBox
                            month={month}
                            key={month.id}
                            setCurrentMonth={setCurrentMonth}
                        />
                    ))}
                    <Animated.View
                        style={[styles.selector, { top: topPosition, left: 0 }]}
                    ></Animated.View>
                </View>
                <View style={styles.childrenContainer}>{children}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
    },
    selector: {
        flex: 1,
        width: 60,
        height: 50,
        backgroundColor: "#F05941",
        position: "absolute",
        zIndex: 1,
    },
    appSquare: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "white",
    },
    yearBar: {
        flex: 5,
        justifyContent: "center",
    },
    sidebar: {
        flex: 1,
        flexDirection: "row",
    },
    content: {
        flex: 1,
        flexDirection: "column",
        borderRightWidth: 1,
        borderRightColor: "white",
    },
    topBar: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "white",
        flexDirection: "row",
    },
    monthsContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "white",
        position: "relative",
        backgroundColor: "#872341",
    },
    childrenContainer: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        margin: 5,
    },
});

export default Layout;
