import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/socket';
import { AddMessageRequest, Message } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean => false;
  // TODO: Task 2 - Implement the isRequestValid function

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean => false;
  // TODO: Task 2 - Implement the isMessageValid function

  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    try{
      
      const { messageToAdd } = req.body;

      if(!messageToAdd.msg || !messageToAdd.msgFrom){
        res.status(400).json({error: 'Message content and sender are required'});
        return;
      }
      
      const message: Message = {
        ...messageToAdd,
        msgDateTime: new Date()
      }

      const messageResponse = await saveMessage(message);

      if('error' in messageResponse){
        res.status(500).json({error: messageResponse.error});
        return;
      }

      socket.emit('messageUpdate', { msg: messageResponse });
      res.status(201).json(messageResponse);
    } catch(exception: unknown){
      console.error('addMessageRoute Unknown exception!', exception);
      res.status(500).json({error: 'Failed to send message'});
    }
  };

  /**
   * Fetch all messages in descending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    try{
      const messages = await getMessages();

      res.status(200).json(messages);
    } catch(exception: unknown){
      console.error('getMessagesRoute Unknown exception!', exception);
      res.status(500).json([]);
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router
  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;
