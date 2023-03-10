import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import Registration from '../Screens/Registration';
import Profile from '../Screens/ProfileScreen';
import SuggestedStudents from '../Screens/StudentsListSuggestion';

const AuthStackProvider = createStackNavigator();

export function MyStack() {
  return (
    <AuthStackProvider.Navigator>
      <AuthStackProvider.Screen name="Home" component={Home} />
      <AuthStackProvider.Screen name="Registration" component={Registration} />
      <AuthStackProvider.Screen name="ProfileScreen" component={Profile} />
      <AuthStackProvider.Screen
        name="Suggestions"
        component={SuggestedStudents}
      />
    </AuthStackProvider.Navigator>
  );
}
const styles = StyleSheet.create({});
