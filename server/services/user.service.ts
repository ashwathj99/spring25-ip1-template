import UserModel from '../models/users.model';
import { SafeUser, User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    // Persist the object to database.
    const savedUser = await UserModel.create(user);

    if(!savedUser){
      return { error: 'Failed to save user' };
    }

    const safeUser: SafeUser = {
      _id: savedUser._id,
      username: savedUser.username,
      dateJoined: savedUser.dateJoined,
    };

    return safeUser;
  } catch (exception: unknown) {
    console.error('saveUser Failed to save user', exception);
    return { error: 'Failed to save user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return { error: 'User not found' };
    }

    const safeUser: SafeUser = {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };

    return safeUser;
  } catch (exception: unknown) {
    console.error('getUserByUsername Unknown exception!', exception);
    return { error: 'Failed to get user' };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username: loginCredentials.username });

    // Validate if user exists and the password matches.
    if (!user || ((user.password && (user.password !== loginCredentials.password)))) {
      return { error: 'Invalid username or password' };
    }

    const safeUser: SafeUser = {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };

    return safeUser;
  } catch (exception: unknown) {
    console.error('loginUser Unknown exception!', exception);
    return { error: 'Failed to login' };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ username });

    if (!deletedUser) {
      return { error: 'User not found' };
    }

    const safeUser: SafeUser = {
      _id: deletedUser._id,
      username: deletedUser.username,
      dateJoined: deletedUser.dateJoined,
    };

    return safeUser;
  } catch (exception: unknown) {
    console.error('deleteUserByUsername Unknown exception!', exception);
    return { error: 'Failed to delete user' };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {username},
      updates,
      {new: true}
    );

    if (!updatedUser) {
      return { error: 'User not found' };
    }

    const safeUser: SafeUser = {
      _id: updatedUser._id,
      username: updatedUser.username,
      dateJoined: updatedUser.dateJoined,
    };

    return safeUser;
  } catch (exception: unknown) {
    console.error('updateUser Unknown exception!', exception);
    return { error: 'Failed to update user details' };
  }
};
