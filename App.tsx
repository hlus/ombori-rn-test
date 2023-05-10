import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {User} from './api/User.dto';
import {UserCard} from './components/UserCard';
import {fetchUsers} from './api/fetch-users';

export const App: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([] as User[]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const currentPage = React.useRef(1);

  const userKeyExtractor = (item: User) => item.id.toString();
  const renderUserCard = ({item}: ListRenderItemInfo<User>) => (
    <UserCard user={item} />
  );
  const renderFooter = () => {
    return users.length >= totalUsers ? (
      <Text style={styles.footer}>No More Users</Text>
    ) : null;
  };

  const getUsers = async (page: number) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const fetchedUsers = await fetchUsers(page);

      setTotalUsers(fetchedUsers.total);

      setUsers(prevUsers =>
        page === 1 ? fetchedUsers.data : [...prevUsers, ...fetchedUsers.data],
      );

      currentPage.current = page;
    } catch (error) {
      // TODO: handle error
    } finally {
      setLoading(false);
    }
  };

  const onEndreached = () => getUsers(currentPage.current + 1);
  const onRefresh = () => getUsers(1);

  React.useEffect(() => {
    getUsers(1);
  }, []);

  return (
    <View style={styles.screen}>
      <FlatList
        data={users}
        keyExtractor={userKeyExtractor}
        renderItem={renderUserCard}
        onEndReached={onEndreached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignSelf: 'center',
  },
});
