// OrderConfirmationScreen.js
import React, {useEffect, useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Button, Clipboard, Alert, TouchableOpacity } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';

const OrderConfirmationScreen = ({ route }) => {
  const {
    products,
    totalArea,
    totalCost,
    amtPaid,
    balance,
    deliveryDate,
    orderNumber,
    orderDate,
    user
  } = route.params.orderDetails; // Assuming these details are passed from the previous screen

  const[ocn , setOcn]=useState('SLS');

  useEffect(() => {
    getOrderChannelNumber();
  }, []);

const getOrderChannelNumber=()=>{
  setOcn(user.chnl+'-'+orderNumber);


}
  // Function to generate the WhatsApp message
  const generateWhatsAppMessage = () => {


    let message = `*Order Confirmation*\n\n`;
    message += `*Order Number:* ${orderNumber}\n`;
    message += `*Order Channel Number:* ${ocn}\n`;
    message += `*Order Date:* ${orderDate}\n`;
    message += `*Order By:* ${user.name} \n`;
    message += `*Total Area:* ${totalArea} sq ft\n`;
    message += `*Total Cost:* ₹${totalCost}\n`;
    message += `*Amount Paid:* ₹${amtPaid}\n`;
    message += `*Balance:* ₹${balance}\n`;
    message += `*Delivery Date:* ${deliveryDate}\n\n`;
    
    message += `*Products List:* \n`;
    products.forEach((product, index) => {
      message += `\nProduct ${index + 1}: \n`;
      message += `Type: ${product.subtype} - ${product.type}\n`;
      message += `Color: ${product.color}\n`;
      message += `Size: ${product.size}\n`;
      message += `Area: ${product.area} sq ft\n`;
      message += `Cost: ₹${product.cost}\n`;
      message += `Comments: ${product.comments || 'N/A'}\n`;
    });
    
    return message;
  };

  // Function to send the message via WhatsApp
  const sendWhatsAppMessage = () => {
    const message = generateWhatsAppMessage();
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device.');
        }
      })
      .catch((err) => {
        console.error('Failed to open WhatsApp', err);
        Alert.alert('Error', 'An error occurred while trying to open WhatsApp.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Order Confirmation</Text>
        <Text style={styles.header}>Order Number : {orderNumber}</Text>
        <Text style={styles.header}>Order Channel Number : {ocn}</Text>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.detailText}>Total Area: {totalArea} sq ft</Text>
          <Text style={styles.detailText}>Total Cost: ₹{totalCost}</Text>
          <Text style={styles.detailText}>Amount Paid: ₹{amtPaid}</Text>
          <Text style={styles.detailText}>Balance: ₹{balance}</Text>
          <Text style={styles.detailText}>Delivery Date: {deliveryDate}</Text>
        </View>

        <Text style={styles.header}>Products List</Text>
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <Text style={styles.productText}>Product: {product.subtype} - {product.type}</Text>
            <Text style={styles.productText}>Color: {product.color}</Text>
            <Text style={styles.productText}>Size: {product.size}</Text>
            <Text style={styles.productText}>Area: {product.area} sq ft</Text>
            <Text style={styles.productText}>Cost: ₹ {product.cost}</Text>
            <Text style={styles.productText}>Comments: {product.comments || 'N/A'}</Text>
          </View>
        ))
      ) : (
        <Text>No products available.</Text>
      )}

        
        <TouchableOpacity style={styles.sendButton} onPress={sendWhatsAppMessage}>
          <Text style={styles.buttonText}>Send Confirmation via WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderDetails: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  productContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sendButton: {
    backgroundColor: '#25D366', // WhatsApp green color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default OrderConfirmationScreen;
