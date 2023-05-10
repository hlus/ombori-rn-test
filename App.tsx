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
import {UserCard} from './components/UserCard.component';
import {fetchUsers} from './api/fetch-users';
import {ScreenLoader} from './components/ScreenLoader.component';

export const App: React.FC = () => {
  const [screenLoading, setScreenLoading] = React.useState(true);

  const [usersLoading, setUsersLoading] = React.useState(false);
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
    if (usersLoading) {
      return;
    }

    try {
      setUsersLoading(true);

      const fetchedUsers = await fetchUsers(page);

      setTotalUsers(fetchedUsers.total);

      setUsers(prevUsers =>
        page === 1 ? fetchedUsers.data : [...prevUsers, ...fetchedUsers.data],
      );

      currentPage.current = page;
    } catch (error) {
      // TODO: handle error
    } finally {
      setUsersLoading(false);
    }
  };

  const onEndreached = () => getUsers(currentPage.current + 1);
  const onRefresh = () => getUsers(1);

  React.useEffect(() => {
    getUsers(1);
    setScreenLoading(true);

    const sub = setTimeout(() => {
      setScreenLoading(false);
    }, 3000);

    return () => clearTimeout(sub);
  }, []);

  if (screenLoading) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={users}
        keyExtractor={userKeyExtractor}
        renderItem={renderUserCard}
        onEndReached={onEndreached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={onRefresh} />
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
