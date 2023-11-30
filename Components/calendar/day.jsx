import React, { useContext, useEffect, useState } from "react";
import FlatListRefContext from "../context/flatListContext";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const windowWidth = Dimensions.get("window").width;
const windowHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;
const containerWidth = windowWidth / 7 - 5;
const containerHeight = windowHeight / 11;

export const Day = ({ day, isCurrentMonth, month, isToday, year }) => {
    const { dropDownRef, theme } = useContext(FlatListRefContext);
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
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: "transparent",
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
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    position: "relative"
                }}
            >
                <View style={{ position: "absolute", top: "25%" }}>
                    {isToday && (
                        <MaterialIcons
                            name="today"
                            size={12}
                            color={theme.primary}
                        />
                    )}
                </View>
                <Text
                    style={{
                        color: isCurrentMonth
                            ? theme.primary
                            : theme.primaryHighFade,
                        padding: 2,
                        fontSize: containerHeight / 4,
                        fontFamily: "Poppins-Light",
                    }}
                    adjustsFontSizeToFit={true}
                >
                    {day}
                </Text>
                <View style={{ position: "absolute", bottom: "35%", borderRadius: 100, width: containerWidth * 0.5, height: 5, backgroundColor: color ? color : "transparent" }} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: containerWidth,
        height: containerWidth * 2,
        borderRadius: 100,
        margin: 2,
    },
});

export default Day;
