import axios from 'axios';

const API_URL = "http://localhost:5000/products"

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const response = await axios.post(API_URL, product);
    return response.data; 
  } catch (error) { 
    console.error("Erro ao adicionar produto:", error);
    throw error;
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
    return response.data; 
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
};
