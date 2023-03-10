import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '@react-native-firebase/app';
import '@react-native-firebase/database';
import {StyleSheet} from 'react-native';

// Initialize Firebase app
const firebaseConfig = {
  // Add your Firebase project credentials here
};
firebase.initializeApp(firebaseConfig);

const Registration = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [universityId, setUniversityId] = useState('');

  const handleRegister = () => {
    // generate a unique ID for the student using Firebase's push() method
    // const id = firebase.database().ref().child('students').push().key;
    const newUniversityId = Math.random().toString(36).substring(2, 8);
    setUniversityId(newUniversityId);
    // create a new student object with the form data
    const newStudent = {
      name,
      email,
      address,
      universityId: newUniversityId,
    };

    // save the new student object to Firebase's real-time database
    firebase
      .database()
      .ref('students')
      .push(newStudent)
      .then(() => {
        Alert.alert('Registered successfully');
      })
      .catch(error => {
        Alert.alert(`Error: ${error.message}`);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          style={styles.input}
        />
        <TextInput
          placeholder="Location"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <Text style={styles.text}>University ID:</Text>
        <TextInput style={styles.input} value={universityId} editable={false} />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}> Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 26,
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    width: Dimensions.get('screen').width - 100,
    margin: 10,
    borderRadius: 16,
    padding: 16,
  },
  inputContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonContainer: {
    backgroundColor: 'blue',
    borderRadius: 6,
  },
  buttonText: {
    padding: 12,
  },
});
