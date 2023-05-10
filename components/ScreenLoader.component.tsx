import React from 'react';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {View, StyleSheet} from 'react-native';

export const ScreenLoader: React.FC = () => {
  const internal = useSharedValue(0);
  const external = useSharedValue(0);

  React.useEffect(() => {
    internal.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    const subs = setTimeout(() => {
      external.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }, 1000);

    return () => clearTimeout(subs);
  }, []);

  const internalCicrle = useAnimatedStyle(() => {
    const opacity = interpolate(
      internal.value,
      [0, 0.8, 1],
      [0.2, 0.1, 0],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      internal.value,
      [0, 1],
      [0.4, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity: opacity,
      transform: [{scale}],
    };
  });

  const lastCircle = useAnimatedStyle(() => {
    const opacity = interpolate(
      external.value,
      [0, 0.8, 1],
      [0.2, 0.1, 0],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      external.value,
      [0, 1],
      [0.4, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity: opacity,
      transform: [{scale}],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.staticCircle} />
      <Animated.View
        style={[styles.staticCircle, styles.animatedCircle, internalCicrle]}
      />
      <Animated.View
        style={[styles.staticCircle, styles.animatedCircle, lastCircle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticCircle: {
    width: 16,
    borderRadius: 8,
    height: 16,
    position: 'absolute',
    backgroundColor: '#7FB900',
  },
  animatedCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.2,
  },
});
