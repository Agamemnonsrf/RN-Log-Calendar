import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";

export default BarsMenuIcon = () => {
    const { sideMenuRef } = useContext(FlatListRefContext);

    return (
        <TouchableOpacity
            style={{
                width: 50,
                height: 50,
                backgroundColor: "rgba(41, 128, 185, 0.4)",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={() => sideMenuRef.current.showMenu()}
        >
            <Octicons name="three-bars" size={32} color="white" />
        </TouchableOpacity>
    );
};
