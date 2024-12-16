import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getProducts, addProduct, updateProduct, deleteProduct } from './api';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    quantity: 0,
    photo: ''
  });

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar os produtos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.quantity) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      await addProduct(newProduct);
      setNewProduct({ name: '', description: '', quantity: 0, photo: '' });  
      fetchProducts();  
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();  
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o produto');
    }
  };

  const handleUpdateProduct = async (id) => {
    const updatedProduct = {
      name: 'Novo nome',
      description: 'Nova descrição',
      quantity: 20,
      photo: ''
    };

    try {
      await updateProduct(id, updatedProduct);
      fetchProducts();  
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Lista de Produtos</Text>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Quantidade: {item.quantity}</Text>

            <TouchableOpacity onPress={() => handleUpdateProduct(item._id)}>
              <Text style={{ color: 'blue' }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
              <Text style={{ color: 'red' }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />

      <View style={{ marginTop: 20 }}>
        <TextInput
          placeholder="Nome do Produto"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Descrição do Produto"
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Quantidade"
          keyboardType="numeric"
          value={String(newProduct.quantity)}
          onChangeText={(text) => setNewProduct({ ...newProduct, quantity: Number(text) })}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        <Button title="Adicionar Produto" onPress={handleAddProduct} />
      </View>
    </View>
  );
};

export default ProductScreen;
