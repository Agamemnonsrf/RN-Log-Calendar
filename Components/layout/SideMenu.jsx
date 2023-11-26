import React, {
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useEffect,
} from "react";
import {
    View,
    Pressable,
    Text,
    Dimensions,
    Animated,
    BackHandler,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SideMenu = forwardRef((props, ref) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const menuWidth = useRef(new Animated.Value(0)).current;
    const subContainerWidth = useRef(new Animated.Value(0)).current;
    const initialSubContainerWidth = screenWidth;

    const showMenu = () => {
        Animated.parallel([
            Animated.timing(menuWidth, {
                toValue: screenWidth,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(subContainerWidth, {
                toValue: initialSubContainerWidth,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setMenuOpen(true);
        });
    };

    const hideMenu = () => {
        Animated.parallel([
            Animated.timing(menuWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(subContainerWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setMenuOpen(false);
        });
    };

    useImperativeHandle(ref, () => ({
        showMenu,
    }));

    useEffect(() => {
        console.log("add back handler sidemenu");
        const backAction = () => {
            console.log("back action");

            hideMenu();
            return true;
        };

        const backHandlerMenu = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            console.log("remove back handler");
            backHandlerMenu.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.subContainer, { width: menuWidth }]}
                onStartShouldSetResponder={() => true}
            >
                <View>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            {
                                width: "100%",
                                backgroundColor: "rgba(41, 128, 185, 0.4)",
                                justifyContent: "flex-end",
                            },
                        ]}
                        onPress={hideMenu}
                    >
                        <Ionicons
                            name="close-outline"
                            size={30}
                            color="white"
                            style={{ marginRight: 10 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => props.showChildMenu()}
                    >
                        <MenuItem
                            icon={"color-palette-outline"}
                            text="Themes"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <MenuItem
                            icon={"cloud-upload-outline"}
                            text="Export Notes"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <MenuItem
                            icon={"cloud-download-outline"}
                            text="Import Notes"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <MenuItem icon={"settings-outline"} text="Settings" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
});

const MenuItem = (props) => {
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: "15%",
                    height: "100%",
                    backgroundColor: "rgba(44, 62, 80, 0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons name={props.icon} size={30} color="white" />
            </View>
            <Text style={styles.menuItemText}>{props.text}</Text>
        </View>
    );
};

const styles = {
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 5,
    },
    subContainer: {
        backgroundColor: "#2B303A",
        position: "relative",
        height: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        height: screenHeight / 11,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    menuItemText: {
        fontSize: 17,
        marginLeft: 10,
        color: "white",
        fontWeight: "500",
    },
};

export default SideMenu;
