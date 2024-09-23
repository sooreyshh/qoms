import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalculationScreen from './CalculationScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import CustomerDetailsScreen from './CustomerDetailsScreen';
import OrderConfirmationScreen from './OrderConfirmationScreen';
import OrderList from './OrdersList';

const Stack = createStackNavigator();

const RoleBasedNavigator = ({ role }) => {
  return (
    <Stack.Navigator initialRouteName="Calculation">
      
        <Stack.Screen
          name="Calculation"
          component={CalculationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
      {role === 'admin' && <Stack.Screen name="OrderList" component={OrderListScreen} />}
    </Stack.Navigator>
  );
};

export default RoleBasedNavigator;
