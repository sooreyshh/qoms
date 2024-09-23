
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { user } = route.params;
  
  const [customerDetails, setCustomerDetails] = useState({
    id: '',
    _id :'',
    name: 'Suresh1',
    address: 'Balanagar1',
    email: 'sp1@gmail.com',
    phone: '9885100001',
    floor: '1'
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
  const goToCalculationScreen = () => {
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

    const handleCustomerDetails = async () => {
      try {
        let payload = Object.assign({}, {
          customer: customerDetails,
         
        });

console.log("pl ", payload)
delete payload.customer['_id'];
console.log("pl ", payload)
        const response = await fetch('https://omssvc.el.r.appspot.com/customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          
          console.log("result order", result);
          
          let customer = result.customer;
          //setCustomerDetails(result.customer);
          

          navigation.navigate('Calculation', { user, customer });
        } else {
          Alert.alert('Error', 'Failed to save/update Customer');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
        Alert.alert('Error', errorMessage, [{ text: 'OK', onPress: () => console.log('Error acknowledged') }], { cancelable: false });
      }
    };

    handleCustomerDetails();
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
          
          

        <TouchableOpacity style={styles.button} onPress={goToCalculationScreen}>
          <Text style={styles.buttonText}>Estimate/Select Product</Text>
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

export default CustomerDetailsScreen;