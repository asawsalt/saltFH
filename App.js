import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Users = [
  { id: "1", name: "Baby", uri: require('./assets/1.jpg') },
  { id: "2", name: "Blow Dryer", uri: require('./assets/2.jpg') },
  { id: "3", name: "Board Games", uri: require('./assets/3.jpg') },
  { id: "4", name: "Books", uri: require('./assets/4.jpg') },
  { id: "5", name: "Cat", uri: require('./assets/5.jpg') },
  { id: "6", name: "Coffee", uri: require('./assets/6.jpg') },
  { id: "7", name: "Dog", uri: require('./assets/7.jpg') },
  { id: "8", name: "Fitness", uri: require('./assets/8.jpg') },
  { id: "9", name: "Gadgets", uri: require('./assets/9.jpg') },
  { id: "10", name: "Game Console", uri: require('./assets/10.jpg') },
  { id: "11", name: "Keys", uri: require('./assets/11.jpg') },
  { id: "12", name: "Kids", uri: require('./assets/12.jpg') },
  { id: "13", name: "Music Instrument", uri: require('./assets/13.jpg') },
  { id: "14", name: "Music System", uri: require('./assets/14.jpg') },
  { id: "15", name: "Oven", uri: require('./assets/15.jpg') },
  { id: "16", name: "Painting", uri: require('./assets/16.jpg') },
  { id: "17", name: "Parents", uri: require('./assets/17.jpg') },
  { id: "18", name: "Plant Flowers", uri: require('./assets/18.jpg') },
  { id: "19", name: "Recliner", uri: require('./assets/19.jpg') },
  { id: "20", name: "Tea", uri: require('./assets/20.jpg') },
];

const data_link = "https://gist.githubusercontent.com/ksukrit/a2c278cd6f5832f929a421a013ab52db/raw/0f979f47826e224491b4468e8b5f5b1b3d697d01/prompt_advice_filtered.json";

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFontLoaded] = useFonts({
    // Add your custom fonts here if needed
  });
  const [likedCards, setLikedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [top5Selected, setTop5Selected] = useState(false);
  const [financialHoroscope, setFinancialHoroscope] = useState(null);
  const [data, setData] = useState(null);

  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      { rotate: rotate },
      ...position.getTranslateTransform(),
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const myPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        handleSwipe('like');
      } else if (gestureState.dx < -120) {
        handleSwipe('dislike');
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
        }).start();
      }
    },
  });

  const handleSwipe = (action) => {
    const currentCard = Users[currentIndex];
    if (action === 'like') {
      setLikedCards([...likedCards, currentCard]);
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    } else if (action === 'dislike') {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    }
  };

  const getCombination = (selectObjects) => {
    selectObjects = selectObjects.map((id) => Users.find((item) => item.id === id).name);
    selectObjects.sort();
    let combinationString = '';
    for (let i = 0; i < selectObjects.length; i++) {
      combinationString += selectObjects[i] + ', ';
    }
    combinationString = combinationString.slice(0, -2);
    return combinationString;
  };

  const getData = (selectObjects) => {
    if (!data) {
      return "Data not loaded yet";
    }
    const combinationString = getCombination(selectObjects);
    return data[combinationString];
  };

  useEffect(() => {
    if (isFontLoaded) {
      fetch(data_link)
        .then(response => response.json())
        .then(json => {
          setData(json);
        })
        .catch(error => console.error(error));
    }
  }, [isFontLoaded]);

  useEffect(() => {
    if (top5Selected) {
      setFinancialHoroscope(getData(selectedCards));
    }
  }, [top5Selected, selectedCards]);

    const renderFinancialHoroscope = () => {
      if (!data) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>Loading...</Text>
          </View>
        );
      }

      const selectedCategories = getCombination(selectedCards);
      const horoscopeMessage = financialHoroscope;
      console.log(financialHoroscope)

      if (!horoscopeMessage) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>Horoscope not available for selected categories</Text>
                <Text>{typeof selectedCards}</Text>
          </View>
        );
      }

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>Your Financial Horoscope</Text>
          <Text>{horoscopeMessage}</Text>
        </View>
      );
    };

    const renderLikedCards = () => {
      const handleCardPress = (cardId) => {
        if (selectedCards.includes(cardId)) {
          setSelectedCards((prevState) => prevState.filter((id) => id !== cardId));
        } else if (selectedCards.length < 5) {
          setSelectedCards([...selectedCards, cardId]);
        }
      };

      const isContinueButtonEnabled = selectedCards.length === 5;

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>Select your Top 5</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {likedCards.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ margin: 10 }}
                onPress={() => handleCardPress(item.id)}
              >
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    borderWidth: selectedCards.includes(item.id) ? 2 : 0,
                    borderColor: selectedCards.includes(item.id) ? 'black' : 'transparent',
                  }}
                  source={item.uri}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 5,
                    fontSize: 16,
                    fontWeight: selectedCards.includes(item.id) ? 'bold' : 'normal',
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {isContinueButtonEnabled && (
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                padding: 10,
                marginTop: 20,
                borderRadius: 5,
              }}
              onPress={() => {
                fetch(data_link)
                  .then((response) => response.json())
                  .then((json) => {
                    setData(json);
                    setTop5Selected(true);
                  })
                  .catch((error) => console.error(error));
              }}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    };
    
  const renderUsers = () => {
    return Users.map((item, i) => {
      if (i < currentIndex) {
        return null;
      } else if (i === currentIndex) {
        return (
          <Animated.View
            key={item.id}
            {...myPanResponder.panHandlers}
            style={[
              {
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: 'absolute',
                zIndex: 2,
                borderRadius: 20,
                backgroundColor: 'white',
                elevation: 5,
              },
              rotateAndTranslate,
            ]}
          >
            <Animated.View style={{ opacity: likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>

            <Animated.View style={{ opacity: dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 48, color: 'black' }}>{item.name}</Text>
            </View>
          </Animated.View>
        );
      } else if (i === currentIndex + 1) {
        return (
          <Animated.View
            key={item.id}
            style={[
              {
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: 'absolute',
                zIndex: 1,
                borderRadius: 20,
                backgroundColor: 'white',
                elevation: 5,
              },
              {
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardScale }],
              },
            ]}
          >
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 48, color: 'black' }}>{item.name}</Text>
            </View>
          </Animated.View>
        );
      } else {
        return null;
      }
    }).reverse();
  };

  if (!isFontLoaded) {
    return null;
  }

  if (top5Selected) {
    return renderFinancialHoroscope();
  }

  if (currentIndex === Users.length) {
    return renderLikedCards();
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 40 }}></View>
      <View style={{ flex: 1 }}>{renderUsers()}</View>
      <View style={{ height: 40 }}></View>
    </View>
  );
}
