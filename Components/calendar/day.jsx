import React, { useContext, useEffect, useState } from "react";
import FlatListRefContext from "../context/flatListContext";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const windowWidth = Dimensions.get("window").width;
const childrenWidth = windowWidth * 0.83;
const windowHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const containerWidth = (childrenWidth / 7) * 0.9;
const containerHeight = windowHeight / 10;

export const Day = ({ day, isCurrentMonth, month, isToday, year }) => {
    const { dropDownRef } = useContext(FlatListRefContext);
    const [hasData, setHasData] = useState("");
    const [color, setColor] = useState("");

    const getColor = async () => {
        try {
            const value = await AsyncStorage.getItem(
                new Date(year, month - 1, day).toDateString() + "color"
            );
            if (value !== null) {
                return value;
            } else return null;
        } catch (e) {
            console.log(e);
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem(
                new Date(year, month - 1, day).toDateString()
            );
            if (value !== null) {
                return value;
            } else return null;
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getColor().then((color) => color && setColor(color));
        getData().then((value) => value && setHasData(value));
    }, []);

    return (
        <TouchableHighlight
            style={[
                styles.container,
                {
                    borderWidth: isToday ? 2 : 1,
                    borderColor: isCurrentMonth
                        ? isToday
                            ? "white"
                            : "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.3)",
                    backgroundColor: color ? color : "transparent",
                },
            ]}
            onPress={() =>
                dropDownRef.current.showDropdown(
                    year,
                    month,
                    day,
                    hasData || "",
                    setHasData,
                    setColor,
                    color
                )
            }
        >
            <View
                style={{
                    padding: 2,
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Text
                    style={{
                        color: isCurrentMonth
                            ? "white"
                            : "rgba(255,255,255,0.8)",
                        padding: 2,
                        fontSize: containerHeight / 5,
                    }}
                    adjustsFontSizeToFit={true}
                >
                    {day}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    {hasData && (
                        <MaterialCommunityIcons
                            name="script-text"
                            size={12}
                            color={
                                isCurrentMonth
                                    ? "rgba(255,255,255,0.9)"
                                    : "rgba(255,255,255,0.5)"
                            }
                        />
                    )}
                    {isToday && (
                        <MaterialIcons name="today" size={12} color="white" />
                    )}
                </View>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        width: containerWidth,
        height: containerHeight,
        borderRadius: 4,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginHorizontal: 1,
        marginVertical: 2,
    },
    text: {
        position: "absolute",
        top: 5,
        left: 5,
    },
});

export default Day;
