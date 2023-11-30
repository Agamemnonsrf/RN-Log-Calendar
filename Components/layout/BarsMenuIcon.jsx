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
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                alignSelf: "flex-end",
                padding: 10,
                marginTop: Constants.statusBarHeight,
            }}
            onPress={() => sideMenuRef.current.showMenu()}
        >
            <Octicons name="three-bars" size={32} color={theme.primary} />
        </TouchableOpacity>
    );
};
