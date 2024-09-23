
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { customerDetails, rows, totalArea, totalCost, productDetails } = route.params;
  const [amtPaid, setAmtPaid] = useState("");
  const [balance, setBalance] = useState(totalCost.toString());
 

  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    customerId: "",
    productType: productDetails.productType,
    productColor: productDetails.productColor,
    totalCost: totalCost,
    amtPaid : amtPaid,
    balance: balance,
    orderDate: new Date().toISOString(),
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails({ ...customerDetails, [field]: value });
  };

  const handlePaymentDetailsChange = (field, value) => {
    if (field === 'amtPaid') {
      setAmtPaid(value);
      setBalance((totalCost - value).toString());
    } else {
      setPaymentDetails({ ...paymentDetails, [field]: value });
    }
  };

  const placeOrder = () => {
    if (!customerDetails.name || !customerDetails.address || !customerDetails.email || !customerDetails.phone) {
      Alert.alert("Validation Error", "Please fill all customer fields.");
      return;
    }

    if (!validateEmail(customerDetails.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    if (!validatePhone(customerDetails.phone)) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
      return;
    }

    // if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
    //   Alert.alert("Validation Error", "Please fill all payment fields.");
    //   return;
    // }

    const handleSaveOrder = async () => {
      try {
        let payload = {
          customer: customerDetails,
          order: {
            productType: productDetails.productType,
            productColor: productDetails.productColor,
            totalCost: totalCost,
            totalArea: totalArea,
            status: 'Order Placed',
            amtPaid : amtPaid,
            balance:balance,
            phone: customerDetails.phone
          },
          payment: paymentDetails
        };
console.log("pl ", payload)
        const response = await fetch('https://omssvc.el.r.appspot.com/save-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          orderDetails.orderNumber = result.orderNumber;
          orderDetails.balance = result.order.balance;
          orderDetails.amtPaid = result.order.amtPaid;
          console.log("result order", result);
          setOrderDetails(result.order);
          Alert.alert('Success', 'Order and payment details saved successfully');

          navigation.navigate('OrderConfirmation', { customerDetails, rows, totalArea, totalCost, productDetails, orderDetails });
        } else {
          Alert.alert('Error', 'Failed to save order and payment details');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
        Alert.alert('Error', errorMessage, [{ text: 'OK', onPress: () => console.log('Error acknowledged') }], { cancelable: false });
      }
    };

    handleSaveOrder();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.cheader}>
          <Text style={styles.title}>Customer Details</Text>
        </View>
        <View style={styles.customerSection}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={customerDetails.name}
            onChangeText={(value) => handleCustomerDetailsChange('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={customerDetails.address}
            onChangeText={(value) => handleCustomerDetailsChange('address', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={customerDetails.email}
            onChangeText={(value) => handleCustomerDetailsChange('email', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={customerDetails.phone}
            onChangeText={(value) => handleCustomerDetailsChange('phone', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Floor"
            value={customerDetails.floor}
            onChangeText={(value) => handleCustomerDetailsChange('floor', value)}
          />
        </View>

        <View style={styles.cheader}>
          <Text style={styles.title}>Payment Information</Text>
        </View>
        <View style={styles.paymentSection}>
          <View style={styles.row}>
            <Text style={styles.totalText}>Product Type: {productDetails.productType}(sq ft)</Text>
            <Text style={styles.totalText}>Product Color: {productDetails.productColor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Total Area: {totalArea}(sq ft)</Text>
            <Text style={styles.totalText}>Total Cost: ₹{totalCost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Amount Paid: ₹</Text>
            <TextInput
              style={[styles.input, { width: 100 }]}
              placeholder="Amount Paid"
              keyboardType="numeric"
              value={amtPaid}
              onChangeText={(value) => handlePaymentDetailsChange('amtPaid', parseFloat(value))}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Balance: ₹{balance}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cheader: {
    height: 40,
    backgroundColor: '#DD5746',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  customerSection: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', // Light background color for better separation
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;