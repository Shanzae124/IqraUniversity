import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/storage';
import CheckBox from '@react-native-community/checkbox';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

const availableMajors = [
  'Computer Science',
  'Mathematics',
  'English',
  'Biology',
];
const availableInterests = ['Sports', 'Music', 'Art', 'Reading'];

const Profile = ({onClose, onSelect}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [major, setMajor] = useState('');
  const [interests, setInterests] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleCameraOpen = () => {
    setShowImagePicker(true);
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setProfilePicture(response);
        setShowImagePicker(false);
      }
    });
  };

  const handleImageLibraryOpen = () => {
    setShowImagePicker(true);
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setProfilePicture(response);
        setShowImagePicker(false);
      }
    });
  };

  const handleImagePickerClose = () => {
    setShowImagePicker(false);
    setProfilePicture(null);
  };

  const handleFormSubmit = async () => {
    try {
      // Upload the profile picture to Firebase Storage and get the download URL
      const profilePictureRef = firebase
        .storage()
        .ref()
        .child(`profilePictures/${name}`);
      const snapshot = await profilePictureRef.putFile(profilePicture.uri);
      const downloadURL = await snapshot.ref.getDownloadURL();

      firebase.database().ref('students').push({
        name,
        location,
        profilePicture: downloadURL,
        major,
        interests,
      });

      // Reset the form
      setName('');
      setLocation('');
      setProfilePicture(null);
      setMajor('');
      setInterests([]);
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    setProfilePicture(null);
  };

  const handleInterestSelect = interest => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const renderItem = ({item}) => {
    // Render each item in the list as a ListItem component with a Checkbox to allow the user to select it
    return (
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={interests.includes(item)}
          onValueChange={() => handleInterestSelect(item)}
          style={styles.checkbox}
        />
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <View>
      <Button title="Take a photo" onPress={handleCameraOpen} />
      <Button title="Choose from library" onPress={handleImageLibraryOpen} />
      {profilePicture && (
        <Modal animationType="slide" visible={visible}>
          <View style={styles.modalContent}>
            <Text>Profile Picture</Text>
            <Image
              source={{uri: profilePicture.uri}}
              style={styles.profilePicture}
            />
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Save" onPress={() => setVisible(false)} />
          </View>
        </Modal>
      )}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <Picker
        selectedValue={major}
        onValueChange={value => setMajor(value)}
        style={styles.picker}>
        <Picker.Item label="Select your major" value="" />
        {availableMajors.map(major => (
          <Picker.Item label={major} value={major} key={major} />
        ))}
      </Picker>
      <FlatList
        data={availableInterests}
        renderItem={renderItem}
        keyExtractor={item => item}
        extraData={interests}
      />
      <Button title="Submit" onPress={handleFormSubmit} />
      {showImagePicker && (
        <Modal animationType="slide" visible={showImagePicker}>
          <View style={styles.modalContent}>
            <Button title="Cancel" onPress={handleImagePickerClose} />
            <Button title="Take a photo" onPress={handleCameraOpen} />
            <Button
              title="Choose from library"
              onPress={handleImageLibraryOpen}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  profilePicture: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
