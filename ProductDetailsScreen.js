// ProductDetailsScreen.js
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { customerDetails, rows, totalArea, totalCost } = route.params;
  const [productType, setProductType] = useState('');
  const [productColor, setProductColor] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const goToOrderConfirmationScreen = () => {
    if (!productType || !productColor) {
      alert("Please select a product type and color.");
      return;
    }

    const productDetails = { productType, productColor, additionalDetails };
    navigation.navigate('CustomerDetails', { customerDetails, rows, totalArea, totalCost, productDetails });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
       <View style={styles.cheader}>
          <Text style={styles.title}>Product Details</Text>
        </View>
        
        
        <Text style={styles.label}>Select Product Type</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, productType === '25' && styles.selectedOption]} 
            onPress={() => setProductType('25')}
          >
            <Text style={styles.optionText}>25</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionButton, productType === '32' && styles.selectedOption]} 
            onPress={() => setProductType('32')}
          >
            <Text style={styles.optionText}>32</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Product Color</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity onPress={() => setProductColor('teak')}  style={[styles.optionButton, productColor === 'teak' && styles.selectedOptionColor]}>
            <Image source={require('./assets/teak.png')} style={styles.colorImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setProductColor('bcb')}   style={[styles.optionButton, productColor === 'bcb' && styles.selectedOptionColor]}>
            <Image source={require('./assets/bcb.png')} style={styles.colorImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setProductColor('white')}  style={[styles.optionButton, productColor === 'white' && styles.selectedOption]}>
            <Image source={require('./assets/white.png')} style={styles.colorImage} />
          </TouchableOpacity>
           <TouchableOpacity onPress={() => setProductColor('honeygold')}  style={[styles.optionButton, productColor === 'honeygold' && styles.selectedOption]}>
            <Image source={require('./assets/honeygold.png')} style={styles.colorImage} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Additional Details"
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
        />

        <TouchableOpacity style={styles.button} onPress={goToOrderConfirmationScreen}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   cheader: {
    height: 60,
    backgroundColor: '#DD5746',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Shadow for iOS
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#667BC6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#667BC6',
     color: '#000 !important',
  },
  optionText: {
    color: '#000',
    fontSize: 18,
  },
  selectedOptionColor: {
    backgroundColor: '#667BC6',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProductDetailsScreen;
