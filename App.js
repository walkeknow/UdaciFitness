import React from 'react'
import { View, Platform, StatusBar } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import middleware from './middleware/logger'
import History from './components/History'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { purple, white, orange } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { createStackNavigator } from '@react-navigation/stack'
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'
import { setLocalNotification } from './utils/helpers'

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const store = createStore(reducer, applyMiddleware(middleware))
const Stack = createStackNavigator()
const Tab =
  Platform.OS === 'ios'
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator()

function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = null
          if (route.name === 'History') {
            iconName = 'ios-bookmarks'
            return <Ionicons name={iconName} size={size} color={color} />
          } else if (route.name === 'Add Entry') {
            iconName = 'plus-square'
            return <FontAwesome name={iconName} size={size} color={color} />
          } else if (route.name === 'Live') {
            iconName = 'ios-speedometer'
            return <Ionicons name={iconName} size={size} color={color} />
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Platform.OS === 'ios' ? purple : white,
        style: {
          backgroundColor: Platform.OS === 'ios' ? white : purple,
          shadowColor: 'rgba(0, 0, 0, 0.24)',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 6,
          shadowOpacity: 1,
        },
        indicatorStyle: {
          backgroundColor: orange,
        },
      }}
    >
      <Tab.Screen name='History' component={History} />
      <Tab.Screen name='Add Entry' component={AddEntry} />
      <Tab.Screen name='Live' component={Live} />
    </Tab.Navigator>
  )
}

export default class App extends React.Component {
  componentDidMount() {
    setLocalNotification()
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={({ route }) => {
                if (route.name === 'Home') {
                  return {
                    headerShown: false,
                  }
                } else if (route.name === 'EntryDetail') {
                  return {
                    headerTintColor: white,
                    headerStyle: {
                      backgroundColor: purple,
                    },
                  }
                }
              }}
            >
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='EntryDetail' component={EntryDetail} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </Provider>
    )
  }
}
