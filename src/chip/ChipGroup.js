// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  containerScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chipWrapper: {
    height: 40,
    paddingRight: 8,
    paddingBottom: 8,
  },
});

type Props = {
  children: React.Node,
  initialSelectedValues?: Array<mixed>,
  selectedValues?: Array<mixed>,
  maxSelection?: number,
  onChangeSelection: ?(Array<mixed>) => void,
  onPressChild: ?(mixed) => void,
  scroll?: boolean,
};

type State = {
  internalSelectedValues: Array<mixed>,
};

class ChipGroup extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialSelectedValues: null,
    maxSelection: null,
    onChangeSelection: null,
    scroll: true,
  };

  constructor(props: Props) {
    super(props);

    const {initialSelectedValues} = props;

    this.state = {
      internalSelectedValues: initialSelectedValues || [],
    };
  }

  onPressChild = (value: mixed) => {
    const {maxSelection, onPressChild} = this.props;
    if (onPressChild && isFunction(onPressChild)) {
      onPressChild(value);
      return;
    }

    this.setState(
      oldState => {
        const index = oldState.internalSelectedValues.indexOf(value);
        const internalSelectedValues = [...oldState.internalSelectedValues];

        if (index === -1) {
          internalSelectedValues.push(value);
        } else {
          internalSelectedValues.splice(index, 1);
        }

        return {
          internalSelectedValues:
            maxSelection != null ? internalSelectedValues.slice(-maxSelection) : internalSelectedValues,
        };
      },
      () => {
        const {onChangeSelection} = this.props;
        const {internalSelectedValues} = this.state;

        if (onChangeSelection && isFunction(onChangeSelection)) {
          onChangeSelection(internalSelectedValues);
        }
      },
    );
  };

  render() {
    const {children, scroll, selectedValues} = this.props;
    const {internalSelectedValues} = this.state;

    const WrapperComponent = scroll ? ScrollView : View;
    const wrapperProps = scroll
      ? {
          horizontal: true,
          contentContainerStyle: styles.containerScroll,
        }
      : {style: styles.containerWrap};

    return (
      // $FlowFixMe
      <WrapperComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...wrapperProps}
      >
        {React.Children.map(children, child => (
          <View style={styles.chipWrapper}>
            {React.cloneElement(child, {
              selected: selectedValues
                ? selectedValues.includes(child.props.value)
                : internalSelectedValues.includes(child.props.value),
              onPress: this.onPressChild,
            })}
          </View>
        ))}
      </WrapperComponent>
    );
  }
}

export default ChipGroup;
