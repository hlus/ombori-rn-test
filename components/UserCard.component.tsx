import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

import {User} from '../api/User.dto';

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({user}) => {
  return (
    <View style={styles.card}>
      <Image style={styles.avatar} source={{uri: user.avatar}} />
      <Text>
        {user.first_name} {user.last_name}
      </Text>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    margin: 16,
  },
});
