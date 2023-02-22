// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Product, Todo } = initSchema(schema);

export {
  Product,
  Todo
};