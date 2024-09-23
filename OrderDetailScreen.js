import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditOrderScreen1 = ({ route }) => {
  const { order } = route.params;
  console.log('Initial order state:', order);
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState(order);
console.log('Initial orderDetails state:', orderDetails);
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderDetails._id}`, orderDetails);
      alert('Order updated successfully');
      navigation.goBack();
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const handleInputChange = (productId, key, value) => {
    const updatedProducts = orderDetails.products.map((product) =>
      product.id === productId ? { ...product, [key]: value } : product
    );
    setOrderDetails({ ...orderDetails, products: updatedProducts });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Order Details</Text>
        <TextInput
          style={styles.input}
          value={orderDetails.customerId}
          onChangeText={(value) => setOrderDetails({ ...orderDetails, customerId: value })}
          placeholder="Customer ID"
        />
        <FlatList
          data={orderDetails.products}
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
                  placeholder="Width ft"
                  keyboardType="decimal-pad"
                  value={item.widthFeet}
                  onChangeText={(value) => handleInputChange(item.id, 'widthFeet', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="Width in"
                  keyboardType="decimal-pad"
                  value={item.widthInches}
                  onChangeText={(value) => handleInputChange(item.id, 'widthInches', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="Height ft"
                  keyboardType="decimal-pad"
                  value={item.heightFeet}
                  onChangeText={(value) => handleInputChange(item.id, 'heightFeet', value)}
                />
                <TextInput
                  style={styles.inputwh}
                  placeholder="Height in"
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
                  <TextInput
                    style={styles.input}
                    placeholder="Color"
                    value={item.color}
                    onChangeText={(value) => handleInputChange(item.id, 'color', value)}
                  />
                </View>
                
                <View style={styles.pickerContainer}>
                  <Text style={styles.header}>Size</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Size"
                    value={item.size}
                    onChangeText={(value) => handleInputChange(item.id, 'size', value)}
                  />
                </View>

                <TextInput
                  style={styles.commentsInput}
                  placeholder="Comments"
                  value={item.comments}
                  onChangeText={(value) => handleInputChange(item.id, 'comments', value)}
                />
                
                <View style={styles.txtrow}>
                  <Text style={styles.header}>Area (sq ft): {item.area || 'N/A'}</Text>
                  <Text style={styles.header}>Cost (₹): {item.cost || 'N/A'}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <Button title="Save Order" onPress={handleSave} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  productItem: { marginBottom: 20 },
  productTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  headerwhr: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputwh: { flex: 1, marginHorizontal: 5, padding: 8, borderBottomWidth: 1 },
  pickerContainer: { flex: 1, marginRight: 5 },
  commentsInput: { flex: 1, marginVertical: 10, padding: 8, borderBottomWidth: 1 },
  txtrow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default EditOrderScreen1;
