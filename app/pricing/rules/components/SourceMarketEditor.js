import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { Flexbox } from '../../../components/styled/Layout';
import SearchBox from '../../../components/FormFields/SearchBox';

class SourceMarketEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSourceMarketIds: props.selectedSourceMarkets ? props.selectedSourceMarkets.map(x => x.id) : []
    };
  }

  handleSourceMarketSelection = sourceMarketIds => {
    const selectedSourceMarkets = this.props.sourceMarkets.filter(x => [...sourceMarketIds].some(y => y === x.id));

    this.setState({ selectedSourceMarketIds: selectedSourceMarkets.map(x => x.id) }, () =>
      this.props.onSourceMarketChange(selectedSourceMarkets)
    );
  };

  render() {
    const { sourceMarkets, disabled } = this.props;
    const { selectedSourceMarketIds } = this.state;
    return (
      sourceMarkets &&
      sourceMarkets.length > 0 && (
        <Flexbox childrenMarginRight="20px" alignItems="flex-end">
          <SearchBox
            disabled={disabled}
            items={fromJS(sourceMarkets)}
            onChange={this.handleSourceMarketSelection}
            selectedItemIds={fromJS(selectedSourceMarketIds)}
            placeholder={''}
            requireSelection={this.props.tabCount === 1}
          />
        </Flexbox>
      )
    );
  }
}

SourceMarketEditor.propTypes = {
  onSourceMarketChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  sourceMarkets: PropTypes.array,
  selectedSourceMarkets: PropTypes.array,
  tabCount: PropTypes.number.isRequired
};
SourceMarketEditor.defaultProps = {
  sourceMarkets: [],
  selectedSourceMarketIds: []
};

export default SourceMarketEditor;
