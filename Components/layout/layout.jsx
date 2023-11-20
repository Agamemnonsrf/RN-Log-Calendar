import React, { useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Animated,
    ScrollView,
    Dimensions,
    PanResponder,
} from "react-native";
import { months } from "../data/data.js";
import { MonthBox } from "./monthBox.jsx";
import Selector from "./selector.jsx";

const Layout = ({ children, currentMonth, setCurrentMonth }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <View
                    style={{
                        flex: 5,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {children}
                </View>
                <View style={styles.monthsContainer}>
                    {months.map((month) => (
                        <MonthBox
                            month={month}
                            key={month.id}
                            setCurrentMonth={setCurrentMonth}
                        />
                    ))}
                    <Selector />
                </View>
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
        height: "8.33%",

        position: "absolute",
        zIndex: 3,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
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

        position: "relative",
    },
    childrenContainer: {},
    text: {
        color: "white",
        margin: 5,
    },
});

export default Layout;
