import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';

const OrderList = ({ route }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
 const { user } = route.params;
  

 
  const fetchOrders = async () => {
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/orders'); 
       
      const result = await response.json();

      if (response.ok) {
        setOrders(result.orders);
      } else {
        Alert.alert('Error', 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };


  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Order No</Text>
      <Text style={styles.headerCell}>Order Channel No</Text>
      <Text style={styles.headerCell}>Ordered By</Text>
      <Text style={styles.headerCell}>Customer</Text>
      <Text style={styles.headerCell}>Date</Text>
      <Text style={styles.headerCell}>Product Type</Text>
      <Text style={styles.headerCell}>Product Color</Text>
      <Text style={styles.headerCell}>Total Area</Text>
      <Text style={styles.headerCell}>Total Cost</Text>
      <Text style={styles.headerCell}>Amout Paid</Text>
      <Text style={styles.headerCell}>Balance</Text>
      <Text style={styles.headerCell}>Status</Text>
    </View>
  );

  const renderOrder = (item) => (
    <View key={item.orderNumber} style={styles.row}>
    <View key={item.orderNumber} style={styles.orderRow}>
      <Text style={styles.cell}>{item.orderNumber}</Text>
      <Text style={styles.cell}>{item.user.chnl}+'-'+{item.orderNumber}</Text>
      <Text style={styles.cell}>{item.user.name}</Text>
      <Text style={styles.cell}>{item.customer.name}</Text>
      <Text style={styles.cell}>{new Date(item.orderDate).toLocaleDateString()}   </Text>
      </View>
      {item.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cellText}>{product.subtype} - {product.type}</Text>
              <Text style={styles.cellText}>{product.color}</Text>
              <Text style={styles.cellText}>{product.size}</Text>
              <Text style={styles.cellText}>{product.area}</Text>
              <Text style={styles.cellText}>{product.cost}</Text>
            </View>
          ))}
      <Text style={styles.cell}>₹{item.totalCost}</Text>
      <Text style={styles.cell}>₹{item.amtPaid}</Text>
      <Text style={styles.cell}>₹{item.balance}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );
 return (
      <View style={styles.container}>
        <Button title="Fetch Orders" onPress={fetchOrders} />
        <ScrollView contentContainerStyle={styles.table}>
          {renderHeader()}
          {orders.map(renderOrder)}
        </ScrollView>
      </View>
    );
 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderRow: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default OrderList;

