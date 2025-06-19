import UserModel from '../models/users.model';
import { safeUser, user } from '../tests/mockData.models';
import { SafeUser, User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> =>{
  try {

    // Create a model that represents our model in mongo db.
    const newUser = new UserModel(user);

    //Persist the object to database.
    const savedUser = await newUser.save();

    const safeUser: SafeUser = {
      _id: savedUser._id,
      username: savedUser.username,
      dateJoined: savedUser.dateJoined,
    };

    return safeUser;
  } catch (error: any) {
    console.error('Error saving user:'+user, error);
    return { error: error.message || 'Failed to save user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try{
    const user = await UserModel.findOne({username: username}).exec();
    
    if(!user){
      return { error: 'User not found' };
    }

    const _safeUser: SafeUser = {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined
    };

    return safeUser;
  } catch(exception: unknown){
    console.error('getUserByUsername Unknown exception!', exception);
    return { error: 'Failed to get user' };
  }
}

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  try{
    const user = await UserModel.findOne({username: loginCredentials.username}).exec();

    if(!user){
      return { error: 'Invalid username or password' };
    }
    if(user.password!=loginCredentials.password){
      return { error: 'Invalid username or password' };
    }

    const safeUser: SafeUser = {
      _id: user.id,
      username: user.username,
      dateJoined: user.dateJoined
    };

    return safeUser;
  } catch(exception: unknown){
    console.error("loginUser Unknown exception!", exception);
    return { error: 'Failed to login' };
  }
}
  // TODO: Task 1 - Implement the loginUser function. Refer to other service files for guidance.

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try{
    const user = await UserModel.findOneAndDelete({username: username}).exec();

    if(!user){
      return {error: 'User not found'};
    }

    const safeUser: SafeUser = {
      _id: user.id,
      username: user.username,
      dateJoined: user.dateJoined
    };

    return safeUser;
  } catch(exception: unknown){
    console.error("deleteUserByUsername Unknown exception!", exception);
    return { error: 'Failed to delete user' };
  }
}
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
 

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (username: string, updates: Partial<User>): Promise<UserResponse> => {
  try{
    const user = await UserModel.findOneAndUpdate({username: username}, updates, { new: true}).exec();

    if(!user){
      return {error: 'User not found'};
    }

    const safeUser: SafeUser = {
      _id: user.id,
      username: user.username,
      dateJoined: user.dateJoined
    };
  
    return safeUser;
  } catch(exception: unknown){
    console.error("updateUser Unknown exception!", exception);
    return { error: 'Failed to update user details' };
  }
  // TODO: Task 1 - Implement the updateUser function. Refer to other service files for guidance.
}