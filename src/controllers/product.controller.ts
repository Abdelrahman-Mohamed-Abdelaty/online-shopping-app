import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {Product} from "../models";

export const deleteProduct= deleteFactory(Product);
export const updateProduct = updateFactory(Product);
export const getAllProducts= getAllFactory(Product);
export const getProductById=getOneFactory(Product);
export const createProduct=createFactory(Product);