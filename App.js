import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Image, Text, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { TextInput as PaperInput, Card } from 'react-native-paper';

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState(''); 
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://recuperacao-6nur.onrender.com/products/');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const productData = { name, description, quantity, photo };

    try {
      if (editingProduct) {
        await axios.put(`https://recuperacao-6nur.onrender.com/products/${editingProduct._id}`, productData);
      } else {
        await axios.post('https://recuperacao-6nur.onrender.com/products/', productData);
      }

      setName('');
      setDescription('');
      setQuantity('');
      setPhoto(null);
      setEditingProduct(null);
      
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await axios.delete(`https://recuperacao-6nur.onrender.com/products/${productId}`);
              fetchProducts();
            } catch (error) {
              console.error(error);
            }
          }
        },
      ]
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestão de Produtos</Text>

      <PaperInput
        label="Nome do Produto"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <PaperInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <PaperInput
        label="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <PaperInput
        label="URL da Imagem"
        value={photo}
        onChangeText={setPhoto}
        style={styles.input}
      />
      <Button title={editingProduct ? "Atualizar Produto" : "Adicionar Produto"} onPress={handleSubmit} />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Quantidade: {item.quantity}</Text>
            {item.photo && <Image source={{ uri: item.photo }} style={styles.productImage} />}
            <View style={styles.actionsContainer}>
              <Button title="Editar" onPress={() => {
                setName(item.name);
                setDescription(item.description);
                setQuantity(item.quantity);
                setPhoto(item.photo);
                setEditingProduct(item);
              }} />
              <Button title="Deletar" onPress={() => handleDelete(item._id)} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    padding: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productImage: {
    width: 100,
    height: 100,
    marginHorizontal:"auto",
    resizeMode: 'contain',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
