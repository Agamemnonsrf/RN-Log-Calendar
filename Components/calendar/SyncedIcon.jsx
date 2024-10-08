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
                backgroundColor: theme.primaryVeryHighFade,
                paddingHorizontal: 8,
                borderRadius: 100,
                gap: 3
            }}
        >
            <Text
                style={{
                    color: theme.primaryMidFade,
                    fontFamily: "Poppins-Medium",
                }}
            >
                Synced{" "}
            </Text>
            {/* <View style={{
                width: 18,
                height: 18,
                borderRadius: 100,
                backgroundColor: theme.primaryVeryHighFade,
                justifyContent: "flex-end",
                alignItems: "center",
            }}> */}
            <Feather name="check" size={17} color={theme.primaryHighFade} />
            {/* </View> */}
        </View>
    );
};
