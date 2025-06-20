import express, { Response, Router } from 'express';
import {
  UserRequest,
  User,
  UserCredentials,
  UserByUsernameRequest,
  UserResponse,
} from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean => {
    return req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== '' &&
    req.body.password !== undefined &&
    req.body.password !== '';
  }

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if(!isUserBodyValid(req)){
        res.status(400).send('Invalid user body');
        return;
    }

    const newUser: User = {
      ...req.body,
      dateJoined: new Date(),
    };

    try {
      const result: UserResponse = await saveUser(newUser);

      if ('error' in result) {
        console.error('createUser Failed to create user', result.error);
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (exception: unknown) {
      console.error('createUser Unknown exception!', exception);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if(!isUserBodyValid(req)){
          res.status(400).send('Invalid user body');
          return;
      }

      const loginCredentials: UserCredentials = {
        username: req.body.username,
        password: req.body.password,
      };

      const user = await loginUser(loginCredentials);

      if ('error' in user) {
        throw new Error(user.error);
      }

      res.status(200).json(user);
    } catch (exception: unknown) {
      console.error('userLogin Unknown exception!', exception);
      res.status(500).json({ error: 'Failed to login' });
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ error: 'Username is required!' });
        return;
      }

      const user: UserResponse = await getUserByUsername(username);

      if ('error' in user) {
        throw new Error(user.error);
      }

      res.status(200).json(user);
    } catch (exception: unknown) {
      console.error('getUser Unknown exception!', exception);
      res.status(500).json({ error: 'Unknown exception' });
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ error: 'Username is required!' });
        return;
      }

      const userResponse = await deleteUserByUsername(username);

      if ('error' in userResponse) {
        throw new Error(userResponse.error);
      }

      res.status(200).json(userResponse);
    } catch (exception: unknown) {
      console.error('deleteUser Unknown exception!', exception);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const updatedUser = await updateUser(req.body.username, { password: req.body.password });

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      res.status(200).json(updatedUser);
    } catch (exception: unknown) {
      console.error('resetPassword Unknown exception!', exception);
      res.status(500).json({ error: 'Unknown exception' });
    }
  };

  // Define routes for the user-related operations.
  // TODO: Task 1 - Add appropriate HTTP verbs and endpoints to the router

  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.patch('/resetPassword', resetPassword);
  router.get('/getUser/:username', getUser);
  router.delete('/deleteUser/:username', deleteUser);
  return router;
};

export default userController;
