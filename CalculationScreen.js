import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  FlatList
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CalculationScreen = ({ route, navigation }) => {
  const { user, customer } = route.params;
  const [products, setProducts] = useState([]);
  
  const [totalArea, setTotalArea] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const colorCodes = {
    "Grey": "#808080",
    "Black": "#000000",
    "Green Bamboo": "#009688",
    "Pink Tulip": "#FF69B4",
    "Blue Tulip": "#1E90FF",
    "Horse Tree": "#8B4513",
    "Purple Tree": "#6A5ACD",
    "Blue Birds": "#ADD8E6"
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/products');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          Alert.alert('Error', 'Unexpected data format');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch products');
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching products');
    }
  };

  const handleInputChange = (productId, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const newProduct = { ...product, [field]: value, 'productId':product._id };

        if (field === 'widthInches' || field === 'heightInches') {
          const inches = parseInt(value, 10);
          if (isNaN(inches) || inches < 0 || inches > 11) {
            Alert.alert('Invalid Input', `${field === 'widthInches' ? 'Width' : 'Height'} inches must be between 0 and 11.`);
            newProduct[field] = '';
            return product;
          }
        }

        if (['widthFeet', 'widthInches', 'heightFeet', 'heightInches'].includes(field)) {
          const widthFeet = parseFloat(newProduct.widthFeet) || 0;
          const widthInches = parseFloat(newProduct.widthInches) || 0;
          const heightFeet = parseFloat(newProduct.heightFeet) || 0;
          const heightInches = parseFloat(newProduct.heightInches) || 0;
          const totalWidth = widthFeet + widthInches / 12;
          const totalHeight = heightFeet + heightInches / 12;
          newProduct.area = (totalWidth * totalHeight).toFixed(2);
        }

        if (field === 'rate') {
          const rate = parseFloat(newProduct.rate) || 0;
          const area = parseFloat(newProduct.area) || 0;
          newProduct.cost = (area * rate).toFixed(2);
        }

        newProduct.isValid = validateProduct(newProduct);
        return newProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    updateTotals(updatedProducts);
  };

  const validateProduct = (product) => {
    return (
      product.widthFeet &&
      product.widthInches !== undefined &&
      product.heightFeet &&
      product.heightInches !== undefined &&
      product.rate &&
      product.color &&
      product.size
    );
  };

  const updateTotals = (products) => {
    const selected = products.filter(p => p.selected);
    const totalArea = selected.reduce((sum, product) => sum + parseFloat(product.area || 0), 0);
    const totalCost = selected.reduce((sum, product) => sum + parseFloat(product.cost || 0), 0);
    setTotalArea(totalArea.toFixed(2));
    setTotalCost(totalCost.toFixed(2));
  };

  const toggleProductSelection = (productId) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        if (product.isValid) {
          delete product['_id'];
          return { ...product, selected: !product.selected };
        } else {
          Alert.alert('Incomplete Details', 'Please fill in all required fields before selecting the product.');
          return product;
        }
      }
      return product;
    });

    setProducts(updatedProducts);
    updateTotals(updatedProducts);
  };

  const reviewAndPay = () => {
    const selectedProductsForOrder = products.filter(p => p.selected);
    if (selectedProductsForOrder.length === 0) {
      Alert.alert('Error', 'No products selected, Please select Products');
      return;
    }
    const orderDetails = {
      user:user,
      customerDetails : customer,
      products: selectedProductsForOrder,
      totalArea,
      totalCost
    };
    navigation.navigate('OrderReviewAndPayment', { orderDetails });
    console.log('Proceeding to Order Review and Payment', orderDetails);
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.fetchButton} onPress={fetchProducts}>
          <Text style={styles.buttonText}>Get Products</Text>
        </TouchableOpacity>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text style={styles.productTitle}>{item.subtype} - {item.type}</Text>
              
              <View style={styles.headerRow}>
                <Text style={styles.headerwhr}>Width</Text>
                <Text style={styles.headerwhr}>Height</Text>
                <Text style={styles.headerwhr}>Rate</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <TextInput
                  style={styles.inputwh}
                  placeholder="ft"
                  keyboardType="decimal-pad"
                  value={item.widthFeet}
                  onChangeText={(value) => handleInputChange(item.id, 'widthFeet', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="in"
                  keyboardType="decimal-pad"
                  value={item.widthInches}
                  onChangeText={(value) => handleInputChange(item.id, 'widthInches', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="ft"
                  keyboardType="decimal-pad"
                  value={item.heightFeet}
                  onChangeText={(value) => handleInputChange(item.id, 'heightFeet', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="in"
                  keyboardType="decimal-pad"
                  value={item.heightInches}
                  onChangeText={(value) => handleInputChange(item.id, 'heightInches', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rate"
                  keyboardType="decimal-pad"
                  value={item.rate}
                  onChangeText={(value) => handleInputChange(item.id, 'rate', value)}
                />
              </View>
              
              <View style={styles.detailsRow}>
                <View style={styles.pickerContainer}>
                  <Text style={styles.header}>Color</Text>
                  <RNPickerSelect
                    onValueChange={(value) => handleInputChange(item.id, 'color', value)}
                    items={item.colors.map(color => ({ label: color, value: color }))}
                    placeholder={{ label: 'Select Color', value: null }}
                    style={pickerSelectStyles}
                    value={item.color}
                    useNativeAndroidPickerStyle={false}                    
                  />
               
                </View>
                
                <View style={styles.pickerContainer}>
                  <Text style={styles.header}>Size</Text>
                  <RNPickerSelect
                    onValueChange={(value) => handleInputChange(item.id, 'size', value)}
                    items={item.sizes.map(size => ({ label: size, value: size }))}
                    placeholder={{ label: 'Select Size', value: null }}
                    style={pickerSelectStyles}
                    value={item.size}
                  />
                </View>
                <View style={styles.txtrow}>
                  <Text style={styles.header}>Area (sq ft): {item.area}</Text>
                  <Text style={styles.header}>Cost (₹): {item.cost}</Text>
                </View>
              </View>

              <TextInput
                style={styles.commentsInput}
                placeholder="Comments"
                value={item.comments}
                onChangeText={(value) => handleInputChange(item.id, 'comments', value)}
              />

              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: item.isValid ? '#28a745' : '#ccc' }]}
                onPress={() => toggleProductSelection(item.id)}
                disabled={!item.isValid}
              >
                <Text style={styles.selectButtonText}>
                  {item.selected ? 'Deselect' : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Area: {totalArea} sq ft</Text>
          <Text style={styles.totalText}>Total Cost: ₹{totalCost}</Text>
        </View>
        <TouchableOpacity style={styles.reviewAndPayButton} onPress={reviewAndPay}>
          <Text style={styles.buttonText}>Review & Pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginTop:20,
  },
  fetchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
   headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', // Align the header text to the center
  },
  headerwhr: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputwh: {
    flex: 0.5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  commentsInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    marginTop: 10
  },
  selectButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewAndPayButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
});

export default CalculationScreen;
