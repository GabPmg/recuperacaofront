import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Image, Text, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
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
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const productData = { name, description, quantity, photo };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/products/${editingProduct.id}`, productData);
      } else {
        await axios.post('http://localhost:5000/products', productData);
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
              fetchProducts(); 
            } catch (error) {
              console.error(error);
            }
          }
        },
      ]
    );
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!pickerResult.canceled) {
        setPhoto(pickerResult.uri);
      }
    }
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
      <Button title="Selecionar Foto" onPress={handleImagePick} />
      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

      <Button title={editingProduct ? "Atualizar Produto" : "Adicionar Produto"} onPress={handleSubmit} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
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
                setQuantity(item.quantity.toString());
                setPhoto(item.photo);
                setEditingProduct(item);
              }} />
              <Button title="Deletar" onPress={() => handleDelete(item.id)} />
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
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
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
    resizeMode: 'contain',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
