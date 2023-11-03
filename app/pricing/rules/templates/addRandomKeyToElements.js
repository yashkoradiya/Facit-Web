import { v4 as uuidv4 } from 'uuid';

export const addRandomKeyToElements = array => array.map(x => ({ ...x, key: uuidv4() }));
