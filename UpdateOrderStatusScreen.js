import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const UpdateOrderStatusScreen = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation();
  
  // State to manage order details including status and comments
  const [orderDetails, setOrderDetails] = useState({
    ...order,
    status: order.status || '', // Default to empty string if not available
    comments: order.comments || '', // Default to empty string if not available
  });

  // Handle status change
  const handleStatusChange = (value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      status: value,
    }));
  };

  // Handle comments change
  const handleCommentsChange = (value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      comments: value,
    }));
  };

  // Save updated order details
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderDetails._id}`, orderDetails);
      alert('Order updated successfully');
      navigation.goBack();
    } catch (error) {
      alert('Failed to update order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Order</Text>

      <TextInput
        style={styles.input}
        value={orderDetails.status}
        onChangeText={handleStatusChange}
        placeholder="Order Status"
      />

      <TextInput
        style={styles.input}
        value={orderDetails.comments}
        onChangeText={handleCommentsChange}
        placeholder="Comments"
      />

      <Button title="Save Order" onPress={handleSave} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
});

export default UpdateOrderStatusScreen;
