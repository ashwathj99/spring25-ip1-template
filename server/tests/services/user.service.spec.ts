import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../../services/user.service';
import { SafeUser, User, UserCredentials } from '../../types/user';
import { user, safeUser } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');

      const savedUser = (await saveUser(user)) as SafeUser;

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toEqual(user.dateJoined);
    });

  it('should return error when an exception is thrown', async () => {
    jest.spyOn(UserModel, 'create').mockImplementationOnce(() => {
      throw new Error('Database error');
    });
    const result = await saveUser(user);
    expect(result).toEqual({ error: 'Failed to save user' });
    (UserModel.create as jest.Mock).mockRestore?.();
  });

  it('should return error when database create fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'create');
    const result = await saveUser(user) as {error: string};

    UserModel.create(user).catch((error: Error) => {
      expect(error.message).toEqual('Failed to save user');
    });
  });
});

describe('getUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the matching user', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const retrievedUser = (await getUserByUsername(user.username)) as SafeUser;

    expect(retrievedUser.username).toEqual(user.username);
    expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error if no user is found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const retrievedUser = await getUserByUsername(user.username);

    expect(retrievedUser).toEqual({ error: 'User not found' });
  });

  it('should return error when read from database fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');
    UserModel.findOne(user).catch((error: Error) => {
      expect(error.message).toEqual('Database error');
    });
  });

  it('should return error when an exception is thrown in getUserByUsername', async () => {
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => { throw new Error('Database error'); });
    const result = await getUserByUsername('username');
    expect(result).toEqual({ error: 'Failed to get user' });
    (UserModel.findOne as jest.Mock).mockRestore?.();
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the user if authentication succeeds', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const loggedInUser = (await loginUser(credentials)) as SafeUser;

    expect(loggedInUser.username).toEqual(user.username);
    expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error if username does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const errorResponse = await loginUser(credentials);

    expect(errorResponse).toEqual({ error: 'Invalid username or password' });
  });

  it('should return error if password does not match', async () => {
    mockingoose(UserModel).toReturn(user, 'findOne');
    const incorrectPassword = `${user.password}abcd`
    const credentials: UserCredentials = {
      username: user.username,
      password: incorrectPassword,
    };

    const errorResponse = await loginUser(credentials);

    expect(errorResponse).toEqual({ error: 'Invalid username or password' });
  });

  it('should return error when an exception is thrown in loginUser', async () => {
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => { throw new Error('Database error'); });
    const result = await loginUser({ username: 'username', password: 'pass' });
    expect(result).toEqual({ error: 'Failed to login' });
    (UserModel.findOne as jest.Mock).mockRestore?.();
});
});

describe('deleteUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the deleted user when deleted succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

    const deletedUser = (await deleteUserByUsername(user.username)) as SafeUser;

    expect(deletedUser.username).toEqual(user.username);
    expect(deletedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error if user does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndDelete');

    const errorResponse = await deleteUserByUsername(user.username);

    expect(errorResponse).toEqual({ error: 'User not found' });
  });

  it('should return error when an exception is thrown in deleteUserByUsername', async () => {
    jest.spyOn(UserModel, 'findOneAndDelete').mockImplementationOnce(() => { throw new Error('Database error'); });
    const result = await deleteUserByUsername('username');
    expect(result).toEqual({ error: 'Failed to delete user' });
    (UserModel.findOneAndDelete as jest.Mock).mockRestore?.();
  });
});

describe('updateUser', () => {
  const updatedUser: User = {
    ...user,
    password: 'newPassword',
  };

  const safeUpdatedUser: SafeUser = {
    username: user.username,
    dateJoined: user.dateJoined,
  };

  const updates: Partial<User> = {
    password: 'newPassword',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the updated user when updated succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

    const result = (await updateUser(user.username, updates)) as SafeUser;

    expect(result.username).toEqual(user.username);
    expect(result.username).toEqual(updatedUser.username);
    expect(result.dateJoined).toEqual(user.dateJoined);
    expect(result.dateJoined).toEqual(updatedUser.dateJoined);
  });

  it('should return error if user does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const errorResponse = await updateUser(user.username, updates);

    expect(errorResponse).toEqual( { error: 'User not found' });
  });

  it('should return error when an exception is thrown in updateUser', async () => {
    jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementationOnce(() => { throw new Error('Database error'); });

    const result = await updateUser('username', { password: 'new' });

    expect(result).toEqual({ error: 'Failed to update user details' });
    (UserModel.findOneAndUpdate as jest.Mock).mockRestore?.();
  });
})
});