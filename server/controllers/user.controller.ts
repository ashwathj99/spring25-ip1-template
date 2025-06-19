import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest, UserResponse } from '../types/types';
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
  const isUserBodyValid = (req: UserRequest): boolean => false;
  // TODO: Task 1 - Implement the isUserBodyValid function

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the createUser function
     try {
      const { username, password } = req.body;

      if(!username || !password){
        res.status(400).send('Invalid user body');
        return;
      }

      const newUser: User = {
      username,
      password,
      dateJoined: new Date(), // Set the dateJoined as the current date
    };
    
    const userResponse: UserResponse = await saveUser(newUser);
    
    if('error' in userResponse){
      console.error("createUser Failed to create user.", userResponse.error)
      res.status(500).json({ error: userResponse.error });
      return;
    }

    res.status(200).json(userResponse);
  } catch(exception: unknown){
      console.error("createUser Unknown exception!", exception);
      res.status(500).json({error: "Failed to create user."});
  }};

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the userLogin function
    try{
      const { username, password } = req.body;

      if(!username || !password){
        res.status(400).send('Invalid user body');
        return;
      }

      const credentials: UserCredentials = { username: username, password: password};
      const user = await loginUser(credentials);
      
      if('error' in user){
        res.status(401).json({error: user.error});
        return;
      }

      res.status(200).json(user);
    } catch(exception: unknown){
      console.error("userLogin Unknown exception!", exception);
      res.status(500).json({error: "Failed to login."});
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the getUser function
    try{
      const username = req.params.username;

      if(!username){
        res.status(404).json({error: "Username is required!"});
        return;
      }

      const user: UserResponse = await getUserByUsername(username)
      
      if('error' in user){
        console.error("getUser failed!", user.error);
        res.status(500).json({ error: user.error });
        return;
      }

      res.status(200).json(user);
    } catch(exception: unknown){
      console.error("getUser Unknown exception!", exception);
      res.status(500).json({error: "Unknown exception"});
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try{
      const username = req.params.username;

      if(!username){
        res.status(400).json({error: "Username is required!"});
        return;
      }

      const userResponse = await deleteUserByUsername(username);
      
      if('error' in userResponse){
        console.error("deleteUser failed", userResponse.error);
        res.status(500).json({ error: userResponse.error });
        return;
      }

      res.status(200).json(userResponse);
    } catch(exception: unknown){
      console.error("deleteUser Unknown exception!", exception);
      res.status(500).json({error: "Failed to delete user"});
    }
    // TODO: Task 1 - Implement the deleteUser function
};

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the resetPassword function
    try{
      const { username, password } = req.body;
      if(!username || !password){
        res.status(400).send('Invalid user body');
        return;
      }

      const userResponse = await updateUser(username, { password: password });
      
      if('error' in userResponse){
        console.error("resetPassword failed", userResponse.error);
        res.status(500).json({ error: userResponse.error });
        return;
      }

      res.status(200).json(userResponse);
    } catch(exception: unknown){
      console.error("resetPassword Unknown exception!", exception);
      res.status(500).json({error: "Unknown exception"});
    }
  };

  // Define routes for the user-related operations.
  // TODO: Task 1 - Add appropriate HTTP verbs and endpoints to the router

  router.post("/signup", createUser);
  router.post("/login", userLogin);
  router.patch('/resetPassword', resetPassword);
  router.get("/getUser/:username", getUser);
  router.delete("/deleteUser/:username", deleteUser);
  return router;
};

export default userController;
