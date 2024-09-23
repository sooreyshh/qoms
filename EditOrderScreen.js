import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditOrderScreen = ({ orders }) => {
  const navigation = useNavigation();
  const [orderList, setOrderList] = useState(orders);

  const handleSave = async () => {
    try {
      // Update the orders with the modified details
      await Promise.all(orderList.map(order => 
        axios.put(`http://localhost:5000/orders/${order._id}`, order)
      ));
      alert('Orders updated successfully');
      navigation.goBack();
    } catch (error) {
      alert('Failed to update orders');
    }
  };

  const handleInputChange = (orderId, productId, key, value) => {
    const updatedOrders = orderList.map((order) => {
      if (order._id === orderId) {
        const updatedProducts = order.products.map((product) =>
          product.id === productId ? { ...product, [key]: value } : product
        );
        return { ...order, products: updatedProducts };
      }
      return order;
    });
    setOrderList(updatedOrders);
  };

  const renderProductRow = (orderId, product) => (
    <View style={styles.productRow} key={product.id}>
      <TextInput
        style={styles.inputSmall}
        placeholder="Width ft"
        keyboardType="decimal-pad"
        value={product.widthFeet}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'widthFeet', value)}
      />
      <TextInput
        style={styles.inputSmall}
        placeholder="Width in"
        keyboardType="decimal-pad"
        value={product.widthInches}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'widthInches', value)}
      />
      <TextInput
        style={styles.inputSmall}
        placeholder="Height ft"
        keyboardType="decimal-pad"
        value={product.heightFeet}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'heightFeet', value)}
      />
      <TextInput
        style={styles.inputSmall}
        placeholder="Height in"
        keyboardType="decimal-pad"
        value={product.heightInches}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'heightInches', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Area"
        keyboardType="decimal-pad"
        value={product.area}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'area', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Rate"
        keyboardType="decimal-pad"
        value={product.rate}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'rate', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cost"
        keyboardType="decimal-pad"
        value={product.cost}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'cost', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Area"
        keyboardType="decimal-pad"
        value={product.totalArea}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'totalArea', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Cost"
        keyboardType="decimal-pad"
        value={product.totalCost}
        onChangeText={(value) => handleInputChange(orderId, product.id, 'totalCost', value)}
      />
    </View>
  );

  const renderOrderRow = (order) => (
    <View key={order._id}>
      <Text style={styles.orderTitle}>Order ID: {order._id}</Text>
      {order.products.map((product) => renderProductRow(order._id, product))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Order List</Text>
        {orderList.map((order) => renderOrderRow(order))}
        <Button title="Save All Orders" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  orderTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  productRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  inputSmall: { flex: 1, marginHorizontal: 2, padding: 8, borderBottomWidth: 1 },
  input: { flex: 2, marginHorizontal: 2, padding: 8, borderBottomWidth: 1 },
});

export default EditOrderScreen;
