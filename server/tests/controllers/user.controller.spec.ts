import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import * as util from '../../services/user.service';
import { SafeUser, User, UserResponse } from '../../types/types';

const mockUser: User = {
  _id: new mongoose.Types.ObjectId(),
  username: 'user1',
  password: 'password',
  dateJoined: new Date('2024-12-03'),
};

const mockSafeUser: SafeUser = {
  _id: mockUser._id,
  username: 'user1',
  dateJoined: new Date('2024-12-03'),
};

const mockDBErrorMessage = 'Failed to save user';
const mockFailedToLoginMessage = 'Failed to login';
const mockUpdateUserFailedMessage = 'Failed to update user details';
const mockFailedToGetUserMessage = 'Failed to get user';
const mockFailedToDeleteUserMessage = 'Failed to delete user';

const mockDBErrorResponse: UserResponse = {
  error: mockDBErrorMessage,
}

const mockFailedToLoginResponse: UserResponse = {
  error: mockFailedToLoginMessage,
};

const mockUpdateUserFailedResponse: UserResponse = {
  error: mockUpdateUserFailedMessage,
}

const mockFailedToGetUserResponse: UserResponse = {
  error: mockFailedToGetUserMessage,
}

const mockFailedToDeleteUserResponse: UserResponse = {
  error: mockFailedToDeleteUserMessage,
}

const mockUserJSONResponse = {
  _id: mockUser._id?.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
};

const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');
const updatedUserSpy = jest.spyOn(util, 'updateUser');
const getUserByUsernameSpy = jest.spyOn(util, 'getUserByUsername');
const deleteUserByUsernameSpy = jest.spyOn(util, 'deleteUserByUsername');

describe('Test userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('POST /signup', () => {
    it('should create a new user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      saveUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(saveUserSpy).toHaveBeenCalledWith({ ...mockReqBody, dateJoined: expect.any(Date) });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 for error response from service', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      // Mock save user to return error response.
      saveUserSpy.mockResolvedValueOnce(mockDBErrorResponse);

      const errorResponse = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(errorResponse.status).toBe(500);
      expect(errorResponse.body).toEqual(mockDBErrorResponse);
      expect(saveUserSpy).toHaveBeenCalledWith({ ...mockReqBody, dateJoined: expect.any(Date) });
    });

    //exception case

  });

  describe('POST /login', () => {
    it('should succesfully login for a user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      loginUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(loginUserSpy).toHaveBeenCalledWith(mockReqBody);
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

  it('should return 401 for error response from service', async () => {
    const mockReqBody = {
      username: mockUser.username,
      password: mockUser.password,
    };

    // Mock loginUser to return an error response.
    loginUserSpy.mockResolvedValueOnce(mockFailedToLoginResponse);

    const response = await supertest(app).post('/user/login').send(mockReqBody);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(mockFailedToLoginResponse);
    expect(loginUserSpy).toHaveBeenCalledWith({ 
      username: mockUser.username, 
      password: mockUser.password 
    });
  });
  
  // exception case

  });

  describe('PATCH /resetPassword', () => {
    it('should succesfully return updated user object given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: 'newPassword',
      };

      updatedUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mockUserJSONResponse });
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, { password: 'newPassword' });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: 'newPassword',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 for error response from service', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      // Mock updateUser to return an error response.
      updatedUserSpy.mockResolvedValueOnce(mockUpdateUserFailedResponse);

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockUpdateUserFailedResponse);
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, { password: mockUser.password });
    });

    //exception case

  });

  describe('GET /getUser', () => {
    it('should return the user given correct arguments', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 404 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).get('/user/getUser/');
      expect(response.status).toBe(404);
    });

    it('should return 500 if service threw an error', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockFailedToGetUserResponse);

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockFailedToGetUserResponse);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

  });

  describe('DELETE /deleteUser', () => {
    it('should return the deleted user given correct arguments', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(deleteUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 404 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).delete('/user/deleteUser/');
      expect(response.status).toBe(404);
    });

    it('delete user should return 500 if the service threw an error response', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce(mockFailedToDeleteUserResponse);

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: mockFailedToDeleteUserMessage });
      expect(deleteUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

  });
});
