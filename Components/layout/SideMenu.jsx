import React, {
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useEffect,
    useContext,
} from "react";
import {
    View,
    Text,
    Dimensions,
    Animated,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight =
    Dimensions.get("window").height - Constants.statusBarHeight;

const SideMenu = forwardRef((props, ref) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuWidth = useRef(new Animated.Value(0)).current;
    const subMenuHeight = useRef(new Animated.Value(0)).current;
    const [subMenuSection, setSubMenuSection] = useState(0);

    const { theme } = useContext(FlatListRefContext);

    const showMenu = () => {
        Animated.timing(menuWidth, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setMenuOpen(true);
        });
    };

    const hideMenu = () => {
        setMenuOpen(false);
    };

    const showSubMenu = (section) => {
        if (section === subMenuSection) return;
        Animated.timing(subMenuHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setSubMenuSection(section);
        });
    };

    useEffect(() => {
        Animated.timing(subMenuHeight, {
            toValue: screenHeight - (screenHeight / 11) * 5,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [subMenuSection]);

    useEffect(() => {
        if (!isMenuOpen) {
            Animated.parallel([
                Animated.timing(menuWidth, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isMenuOpen]);

    useImperativeHandle(ref, () => ({
        showMenu,
    }));

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.subContainer,
                    { width: menuWidth, backgroundColor: theme.background },
                ]}
                onStartShouldSetResponder={() => true}
            >
                <View>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            {
                                width: "100%",
                                backgroundColor: theme.secondary,
                                justifyContent: "flex-end",
                            },
                        ]}
                        onPress={hideMenu}
                    >
                        <Ionicons
                            name="close-outline"
                            size={30}
                            color={theme.primary}
                            style={{ marginRight: 10 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { backgroundColor: theme.primaryVeryHighFade },
                        ]}
                        onPress={() => showSubMenu(0)}
                    >
                        <MenuItem
                            icon={"color-palette-outline"}
                            text="Themes"
                            isMenuOpen={isMenuOpen}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { backgroundColor: theme.primaryVeryHighFade },
                        ]}
                        onPress={() => showSubMenu(1)}
                    >
                        <MenuItem
                            icon={"cloud-upload-outline"}
                            text="Export Notes"
                            isMenuOpen={isMenuOpen}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { backgroundColor: theme.primaryVeryHighFade },
                        ]}
                        onPress={() => showSubMenu(2)}
                    >
                        <MenuItem
                            icon={"cloud-download-outline"}
                            text="Import Notes"
                            isMenuOpen={isMenuOpen}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { backgroundColor: theme.primaryVeryHighFade },
                        ]}
                        onPress={() => showSubMenu(3)}
                    >
                        <MenuItem
                            icon={"settings-outline"}
                            text="Settings"
                            isMenuOpen={isMenuOpen}
                        />
                    </TouchableOpacity>
                </View>
                <SubMenu
                    subMenuSection={subMenuSection}
                    subMenuHeight={subMenuHeight}
                />
            </Animated.View>
        </View>
    );
});

const SubMenu = ({ subMenuSection, subMenuHeight }) => {
    const { theme } = useContext(FlatListRefContext);
    return (
        <Animated.View
            style={[
                styles.subMenu,
                { height: subMenuHeight, backgroundColor: theme.quaternary },
            ]}
        >
            {decideSubMenu(subMenuSection)}
        </Animated.View>
    );
};

const decideSubMenu = (subMenuSection) => {
    switch (subMenuSection) {
        case 0:
            return <ThemeSubMenu />;
        case 1:
            return <ExportSubMenu />;
        case 2:
            return <ImportSubMenu />;
        case 3:
            return <SettingsSubMenu />;
        default:
            return <ThemeSubMenu />;
    }
};

const ThemeSubMenu = () => {
    return (
        <View style={styles.subMenuContainer}>
            <Text style={styles.subMenuText}>Themes</Text>
        </View>
    );
};

const ExportSubMenu = () => {
    return (
        <View style={styles.subMenuContainer}>
            <Text style={styles.subMenuText}>Export</Text>
        </View>
    );
};

const ImportSubMenu = () => {
    return (
        <View style={styles.subMenuContainer}>
            <Text style={styles.subMenuText}>Import</Text>
        </View>
    );
};

const SettingsSubMenu = () => {
    return (
        <View style={styles.subMenuContainer}>
            <Text style={styles.subMenuText}>Settings</Text>
        </View>
    );
};

const MenuItem = (props) => {
    const { theme } = useContext(FlatListRefContext);

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
                    backgroundColor: theme.quinary,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons name={props.icon} size={30} color={theme.primary} />
            </View>
            {props.isMenuOpen && (
                <Text style={[styles.menuItemText, { color: theme.primary }]}>
                    {props.text}
                </Text>
            )}
        </View>
    );
};

const styles = {
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 5,
    },
    subContainer: {
        position: "relative",
        height: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        height: screenHeight / 11,
    },
    menuItemText: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "500",
        width: "100%",
    },
    subMenu: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
        zIndex: 5,
    },
    subMenuContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    subMenuText: {
        fontSize: 20,
        color: "white",
    },
};

export default SideMenu;
