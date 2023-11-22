import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default SyncedIcon = () => {
    return (
        <View
            style={{ flexDirection: "row", alignItems: "center", margin: 3 }}
        >
            <Text style={{ color: "white" }}>Synced </Text>
            <Feather name="check" size={24} color="white" />
        </View>
    );
};
