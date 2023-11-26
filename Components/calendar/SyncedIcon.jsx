import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";

export default SyncedIcon = () => {
    const { theme } = useContext(FlatListRefContext);

    return (
        <View style={{ flexDirection: "row", alignItems: "center", margin: 3 }}>
            <Text style={{ color: theme.primary }}>Synced </Text>
            <Feather name="check" size={24} color={theme.primary} />
        </View>
    );
};
