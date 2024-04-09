import React, { useContext } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { Octicons } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";
import Constants from "expo-constants";

export default BarsMenuIcon = () => {
    const { sideMenuRef, theme } = useContext(FlatListRefContext);

    return (
        <TouchableOpacity
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={() => sideMenuRef.current.showMenu()}
        >
            <Octicons name="three-bars" size={32} color={theme.primary} />
        </TouchableOpacity>
    );
};
