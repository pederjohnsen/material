// @flow
import {StyleSheet, View} from 'react-native';
import React, {PureComponent} from 'react';

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  fullWidthDivider: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  dividerLine: {
    borderTopWidth: 1,
  },
});

type Props = {
  fullWidth?: boolean,
  color?: string,
};

class Divider extends PureComponent<Props> {
  static defaultProps = {
    fullWidth: false,
    color: '#0000001e',
  };

  render() {
    const {color, fullWidth} = this.props;

    return (
      <View style={[styles.divider, fullWidth ? styles.fullWidthDivider : null]}>
        <View style={[styles.dividerLine, {borderTopColor: color}]} />
      </View>
    );
  }
}

export default Divider;