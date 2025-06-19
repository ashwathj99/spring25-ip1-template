import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    // Persist the object to database.
    const savedMessage = await MessageModel.create(message);

    return savedMessage;
  } catch (exception: unknown) {
    console.error('saveMessage Failed to save message', exception);
    return { error: 'Failed to save message' };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  try {
    const messages = await MessageModel.find();

    return messages.sort(
      (a, b) => new Date(a.msgDateTime).getTime() - new Date(b.msgDateTime).getTime(),
    );
  } catch (exception: unknown) {
    console.error('getMessages Unknown exception!', exception);
    return [];
  }
};
