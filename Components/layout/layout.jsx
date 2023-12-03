import React, { useRef, useEffect, useContext } from "react";
import {
    View,
    StyleSheet,
    Text,
    Animated,
    ScrollView,
    Dimensions,
    PanResponder,
} from "react-native";
import FlatListRefContext from "../context/flatListContext";
import SideMenu from "./SideMenu.jsx";
import Dropdown from "../calendar/dropdown.jsx";

const Layout = ({ children }) => {
    const { sideMenuRef, theme, dropDownRef } = useContext(FlatListRefContext);

    return (
        <View style={styles.container}>
            <SideMenu ref={sideMenuRef} />
            {/* <Dropdown ref={dropDownRef} /> */}
            <View style={styles.sidebar}>
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
        height: "100%",
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
        alignItems: "center",
        position: "relative",
    },
    childrenContainer: {
        flex: 5,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        color: "white",
        margin: 5,
    },
});

export default Layout;
