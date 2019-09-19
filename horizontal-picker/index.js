import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import ListItemNumber from '../ListItemNumber';

const ITEM_WIDTH = 60;

function createStyles({ backgroundColor, textColor }) {
  return StyleSheet.create({
    container: {
      backgroundColor,
      width: '100%',
      borderRadius: 50,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingVertical: 80,
    },
    selectionContainer: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

    },
    selectedItem: {
      paddingTop: 80,
      fontSize: 60,
      color: textColor,
      fontWeight: '800',
    },
    centerLine: {
      paddingBottom: 50,
      color: textColor,
      fontWeight: '100',
      fontSize: 120,
    },
  });
}

export default function HorizontalPicker(props) {
  const {
    initialValue,
    min,
    max,
    backgroundColor,
    textColor,
    onValueChange,
  } = props;

  const [selectedNumber, setSelectedNumber] = useState(initialValue);
  const [listOffset, setListOffset] = useState(0);
  const length = max - min + 1;
  const range = new Array(length).fill().map((_, index) => index + min);
  const styles = createStyles({ backgroundColor, textColor });
  const flatListRef = useRef(null);

  const centerOnIndex = (index) => {
    if (flatListRef.current && index > -1) {
      flatListRef.current.scrollToIndex({ index, viewPosition: 0.5 });
    }
  };

  const getSelectedIndexForNumber = (number) => range.findIndex(
    (candidate) => candidate === number,
  );

  const updateSelectedNumber = (number) => {
    setSelectedNumber(number);
    onValueChange(number);
    centerOnIndex(getSelectedIndexForNumber(number));
  };

  useEffect(() => {
    updateSelectedNumber(selectedNumber);
  }, [listOffset]);

  const onLayout = ({ nativeEvent }) => {
    const { width } = nativeEvent.layout;
    setListOffset((width / 2) - (ITEM_WIDTH / 2));
  };


  const handleScrollEnd = () => {
    centerOnIndex(getSelectedIndexForNumber(selectedNumber));
  };

  const renderItem = (info) => (
    <ListItemNumber
      number={info.item}
      textColor={textColor}
      updateSelectedNumber={updateSelectedNumber}
    />
  );

  const handleScroll = ({ nativeEvent }) => {
    const viewPortWidth = nativeEvent.layoutMeasurement.width;
    const contentOffsetX = nativeEvent.contentOffset.x;

    const halfOfViewport = viewPortWidth / 2;
    const middlepoint = contentOffsetX + halfOfViewport;

    const withoutOffset = middlepoint - listOffset;
    const calculatedIndex = Math.floor(withoutOffset / ITEM_WIDTH);

    const value = range[calculatedIndex];
    setSelectedNumber(value);
  };

  const getInitialScrollIndex = () => range.findIndex((item) => item === initialValue);

  const flatlistSpacer = () => (<View style={{ width: listOffset }} />);

  return (
    <View style={styles.container}>
      <View style={styles.selectionContainer}>
        <Text style={styles.selectedItem} testID="number">{selectedNumber}</Text>
        <Text style={styles.centerLine}>|</Text>
      </View>
      <FlatList
        ref={flatListRef}
        horizontal
        bounces={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        data={range}
        renderItem={renderItem}
        onLayout={onLayout}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(data, index) => (
          { length: ITEM_WIDTH, offset: listOffset + ITEM_WIDTH * index, index }
        )}
        initialScrollIndex={getInitialScrollIndex()}
        ListHeaderComponent={flatlistSpacer()}
        ListFooterComponent={flatlistSpacer()}
        onScroll={handleScroll}
      />
    </View>
  );
}

HorizontalPicker.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  onValueChange: PropTypes.func,
};

HorizontalPicker.defaultProps = {
  backgroundColor: '#ff9966',
  textColor: 'rgba(255, 255, 255, 0.8)',
  onValueChange: () => { },
};
