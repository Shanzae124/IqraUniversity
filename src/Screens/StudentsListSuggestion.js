import React, {useState, useEffect} from 'react';
import {View, FlatList, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

export const SuggestedStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all students from Firebase real-time database
        const snapshot = await firebase
          .database()
          .ref('students')
          .once('value');
        const studentsObject = snapshot.val();
        const studentsArray = Object.keys(studentsObject).map(key => ({
          id: key,
          ...studentsObject[key],
        }));

        // Set the students state
        setStudents(studentsArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter the students based on the selected filter
    if (filter === 'location') {
      setFilteredStudents(
        students.sort((a, b) => a.location.localeCompare(b.location)),
      );
    } else if (filter === 'major') {
      setFilteredStudents(
        students.sort((a, b) => a.major.localeCompare(b.major)),
      );
    } else if (filter === 'interests') {
      setFilteredStudents(
        students.filter(student =>
          student.interests.some(interest =>
            availableInterests.includes(interest),
          ),
        ),
      );
    } else {
      setFilteredStudents(students);
    }
  }, [students, filter]);

  const handleFilterChange = value => {
    setFilter(value);
  };

  const renderItem = ({item}) => {
    // Render each student as a ListItem component
    return (
      <View>
        <Text>{item.name}</Text>
        <Text>{item.location}</Text>
        <Text>{item.major}</Text>
        <Text>{item.interests}</Text>
      </View>
    );
  };

  return (
    <View>
      <Picker selectedValue={filter} onValueChange={handleFilterChange}>
        <Picker.Item label="No filter" value="" />
        <Picker.Item label="Location" value="location" />
        <Picker.Item label="Major" value="major" />
        <Picker.Item label="Interests" value="interests" />
      </Picker>
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

export default SuggestedStudents;
