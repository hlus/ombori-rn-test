import {PaginationResponse} from './PaginationResponse.dto';
import {User} from './User.dto';

export const fetchUsers = async (page: number) => {
  const rawUsers = await fetch(`https://reqres.in/api/users?page=${page}`);
  const users = await rawUsers.json();

  return users as PaginationResponse<User>;
};
