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
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import FlatListRefContext from "../context/flatListContext";
import colorThemes from "../data/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
                                justifyContent: "space-between",
                            },
                        ]}
                        onPress={hideMenu}
                    >
                        <Text
                            style={{
                                color: isMenuOpen
                                    ? theme.primary
                                    : theme.secondary,
                                fontFamily: "Poppins-Regular",
                                marginLeft: 20,
                                fontSize: 17,
                            }}
                        >
                            Close
                        </Text>
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
                    isMenuOpen={isMenuOpen}
                />
            </Animated.View>
        </View>
    );
});

const SubMenu = ({ subMenuSection, subMenuHeight, isMenuOpen }) => {
    const { theme } = useContext(FlatListRefContext);
    return (
        <Animated.View
            style={[
                styles.subMenu,
                { height: subMenuHeight, backgroundColor: theme.quaternary },
            ]}
        >
            <View style={styles.subMenuContainer}>
                {decideSubMenu(subMenuSection, isMenuOpen)}
            </View>
        </Animated.View>
    );
};

const decideSubMenu = (subMenuSection, isMenuOpen) => {
    switch (subMenuSection) {
        case 0:
            return <ThemeSubMenu isMenuOpen={isMenuOpen} />;
        case 1:
            return <ExportSubMenu isMenuOpen={isMenuOpen} />;
        case 2:
            return <ImportSubMenu isMenuOpen={isMenuOpen} />;
        case 3:
            return <SettingsSubMenu isMenuOpen={isMenuOpen} />;
        default:
            return <ThemeSubMenu isMenuOpen={isMenuOpen} />;
    }
};

const ThemeSubMenu = ({ isMenuOpen }) => {
    const { theme, setTheme } = useContext(FlatListRefContext);

    const themesArray = Array.from(Object.values(colorThemes));
    const handleSetTheme = (themeName) => {
        setTheme(colorThemes[themeName]);
        AsyncStorage.setItem("theme", themeName);
    };

    return (
        <View style={{ width: "100%", height: "100%" }}>
            {isMenuOpen && (
                <FlatList
                    data={themesArray}
                    ListHeaderComponent={() => <View style={{ height: 20 }} />}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => {
                        const colorArray = Array.from(
                            Object.values(item)
                        ).splice(3);

                        return (
                            <TouchableOpacity
                                style={{
                                    width: "90%",
                                    paddingVertical: 10,
                                    height: 100,
                                    marginVertical: 5,
                                    backgroundColor: item.background,
                                    borderRadius: 10,
                                    justifyContent: "space-around",
                                    alignSelf: "center",
                                    shadowColor: item.background,
                                    shadowOffset: {
                                        width: 2,
                                        height: 15,
                                    },
                                    shadowOpacity: 1,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                                onPress={() => handleSetTheme(item.name)}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        paddingHorizontal: 15,
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.subMenuText,
                                            {
                                                color: item.primary,
                                                fontFamily: "Poppins-Regular",
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <View>
                                        {theme.name === item.name && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color={item.primary}
                                            />
                                        )}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-evenly",
                                    }}
                                >
                                    {colorArray.map((color) => {
                                        return (
                                            <View
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    backgroundColor: color,
                                                }}
                                                key={color + item.name}
                                            />
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(item) => item.name}
                />
            )}
        </View>
    );
};

const ExportSubMenu = () => {
    return <Text style={styles.subMenuText}>Export</Text>;
};

const ImportSubMenu = () => {
    return <Text style={styles.subMenuText}>Import</Text>;
};

const SettingsSubMenu = () => {
    return <Text style={styles.subMenuText}>Settings</Text>;
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
                <Text
                    style={[
                        styles.menuItemText,
                        {
                            color: theme.primary,
                            fontFamily: "Poppins-Regular",
                        },
                    ]}
                >
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
        fontSize: 16,
        marginLeft: 15,
        marginBottom: 15,
    },
};

export default SideMenu;
