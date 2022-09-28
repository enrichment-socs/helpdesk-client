import { atom } from 'jotai';
import { Message } from '../models/Message';

const IndexStore = {
  messages: atom<Message[]>([]),
  totalMessagesCount: atom<number>(0),
  skipCount: atom<number>(0),
};

export default IndexStore;
