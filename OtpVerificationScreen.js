// OtpVerificationScreen.js
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });

      if (response.ok) {
        const result = await response.json();
        navigation.navigate('RoleBasedNavigator', { role: result.role });
      } else {
        Alert.alert('Error', 'Failed to verify OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while verifying OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Enter OTP:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default OtpVerificationScreen;
