import React, { useContext } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { Octicons } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";
import Constants from "expo-constants";

const height =
    (Dimensions.get("window").height - Constants.statusBarHeight) / 12;

export default BarsMenuIcon = () => {
    const { sideMenuRef, theme } = useContext(FlatListRefContext);

    return (
        <TouchableOpacity
            style={{
                width: "100%",
                height: height,
                backgroundColor: theme.secondary,
                justifyContent: "center",
                alignItems: "center",
                marginTop: Constants.statusBarHeight + 1,
            }}
            onPress={() => sideMenuRef.current.showMenu()}
        >
            <Octicons name="three-bars" size={32} color={theme.primary} />
        </TouchableOpacity>
    );
};
