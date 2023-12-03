import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import FlatListRefContext from "../context/flatListContext";

export default SyncedIcon = () => {
    const { theme } = useContext(FlatListRefContext);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-end",
            }}
        >
            <Text
                style={{
                    color: theme.primaryHighFade,
                    fontFamily: "Poppins-Medium",
                }}
            >
                Synced{" "}
            </Text>
            <Feather name="check" size={24} color={theme.primaryHighFade} />
        </View>
    );
};
