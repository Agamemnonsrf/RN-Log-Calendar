import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

// ...
export default SpinnerIcon = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true
                }
            )
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }], margin: 3 }}>
            <EvilIcons name="spinner-2" size={24} color="white" />
        </Animated.View>
    );
};

