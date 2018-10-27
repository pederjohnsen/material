// @flow
import findIndex from 'lodash.findindex';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 100,
  },
});

class SnackbarOverlay extends React.PureComponent<any> {
  static DEFAULT_TIMEOUT = 10 * 1000; // 10 seconds

  queue = [];

  constructor(props: any) {
    super(props);

    this.state = {
      currentItem: null,
    };
  }

  queueItem = (
    id: string,
    Component: React.ComponentType<any>,
    props: Object = {},
    timeout: number = SnackbarOverlay.DEFAULT_TIMEOUT,
  ) => {
    this.queue.push({
      id,
      Component,
      props,
      timeout,
    });
  };

  processQueue = () => {
    const currentItem = this.queue.shift();
    const {timeout} = currentItem;

    // Set timeout here rather than setState callback so that we can accurately
    // tell if forceRemoveCurrentItem was called (i.e. if item isn't in pending
    // queue and this.forceRemoveTimeout is null)
    this.forceRemoveTimeout = setTimeout(() => {
      this.forceRemoveTimeout = null;
      this.forceRemoveCurrentItem();
    }, timeout);

    this.setState({
      currentItem,
    });
  };

  dequeueItem = (key: string) => {
    const index = findIndex(this.queue, item => item.key === key);

    if (index !== -1) {
      this.queue.splice(index, 1);
      return;
    }

    // If there's no timeout then forceRemoveCurrentItem was probably already called
    if (!this.forceRemoveTimeout) {
      this.setState(
        {
          currentItem: null,
        },
        () => {
          this.processQueue();
        },
      );
    }
  };

  forceRemoveCurrentItem = () => {
    this.setState(
      {
        currentItem: null,
      },
      () => {
        this.processQueue();
      },
    );
  };

  render() {
    const {currentItem} = this.state;

    if (!currentItem) {
      return null;
    }

    const {Component, props, key} = currentItem;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <Component {...props} key={key} />;
      </View>
    );
  }
}

export default SnackbarOverlay;