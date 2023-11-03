import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import { ErrorToolTip, Flexbox } from '../styled/Layout';
import { FixedSizeList as FList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownHeaderContent,
  DropdownContent,
  DropdownChips,
  DropdownChip,
  DropdownChipLabel,
  DropdownChipRemoveButton,
  DropdownContainer,
  DropdownInput,
  DropdownLabel
} from '../styled/Dropdown';
import { createValueItem, createFilterItem, createCriteriaItem, areArraysEqual } from './form-fields-utils';
import { List } from 'immutable';
import { getDynamicAccom, getPaginatedResorts } from 'components/GeographySearch/api';
import { IconButton } from 'components/styled/Button';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import * as appStateActions from '../../appState/appStateActions';
import { connect } from 'react-redux';
import MultiDownshift from './MultiDownshift';

const LifeCycleStatus = {
  DidMount: 1,
  DidUpdate: 2
};
class AutoCompleteMultiple extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      dynamicOptions: [],
      totalOptionsCount: 0,
      hasNextPage: false,
      loadingOptions: true,
      currentPageNo: 1,
      parentIds: [],
      searchText: '',
      selectedOptions: [],
      cachedState: null,
      /**
       * This property denotes on which state the current API call has been made
       * for dyanmic accommodations.
       */
      dynamicAccomFlag: LifeCycleStatus.DidMount
    };
  }

  componentDidMount() {
    if (this.props.placeholder === 'Resort') {
      const { currentPageNo, searchText } = this.state;
      const { parentIds, selectedItemIds } = this.props;
      const parsedIds = parentIds.toArray();

      getPaginatedResorts(currentPageNo, searchText, parsedIds, selectedItemIds.toArray()).then(response => {
        const { totalRowCount, geographyViewModel } = response.data;

        this.props.setResortsList(geographyViewModel);
        const options = this.parseToImmutableOptions('resort', geographyViewModel, selectedItemIds);
        let filteredSelectedOptions = options.filter(opt => selectedItemIds.includes(opt.value));

        const { selectedOptions } = this.state;
        if (!filteredSelectedOptions.length && selectedOptions.length) {
          filteredSelectedOptions = selectedOptions;
        }

        this.setState({
          dynamicOptions: options,
          totalOptionsCount: totalRowCount,
          hasNextPage: options.length < totalRowCount,
          loadingOptions: false,
          parentIds: parsedIds,
          selectedOptions: filteredSelectedOptions
        });
      });
    } else if (this.isDynamicAccommEnabled()) {
      const { parentIds, selectedItemIds, setDynamicAccomm, dynamicAccommodation } = this.props;
      const { currentPageNo, searchText, selectedOptions } = this.state;

      const parsedParentIds = parentIds.toArray();
      const contractTypes = dynamicAccommodation.get('selectedContractTypes').toArray();

      getDynamicAccom(currentPageNo, searchText, parsedParentIds, selectedItemIds, contractTypes).then(response => {
        const { totalRowCount, geographyAccommodationViewModel } = response.data;

        //If the dynamicAccomFlag is not in ComponentDidMount state, than ignore this update.
        if (this.state.dynamicAccomFlag !== LifeCycleStatus.DidMount) {
          return;
        }
        setDynamicAccomm({
          dynamicAccommodationEnabled: dynamicAccommodation.get('dynamicAccommodationEnabled'),
          dynamicAccomList: geographyAccommodationViewModel,
          resetDynamicAccomList: true
        });

        const options = this.parseToImmutableOptions(
          'accommodationcode',
          geographyAccommodationViewModel,
          selectedItemIds
        );
        let filteredSelectedOptions = options.filter(opt => selectedItemIds.includes(opt.value));

        if (!filteredSelectedOptions.length && selectedOptions.length) {
          filteredSelectedOptions = selectedOptions;
        }

        this.setState({
          dynamicOptions: options,
          totalOptionsCount: totalRowCount,
          hasNextPage: options.length < totalRowCount,
          loadingOptions: false,
          parentIds: parsedParentIds,
          selectedOptions: filteredSelectedOptions
        });
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { placeholder, parentIds, setResortsList, setDynamicAccomm, dynamicAccommodation, selectedItemIds } =
      this.props;

    if (placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
      const prevParentIds = prevProps.parentIds.toArray();
      const curParentIds = parentIds.toArray();

      const curSelectedItemsIds = selectedItemIds.toArray();
      const { dynamicOptions, selectedOptions } = this.state;

      if (
        !areArraysEqual(prevProps.selectedItemIds.toArray(), curSelectedItemsIds) &&
        !areArraysEqual(
          curSelectedItemsIds,
          selectedOptions.map(item => item.value)
        )
      ) {
        this.setState({
          selectedOptions: dynamicOptions.filter(item => curSelectedItemsIds.includes(item.value))
        });
      }

      const currentContractTypes = dynamicAccommodation?.get('selectedContractTypes')?.toArray();
      const prevContractTypes = prevProps.dynamicAccommodation?.get('selectedContractTypes')?.toArray();

      if (placeholder === 'Resort' && !areArraysEqual(curParentIds, prevParentIds)) {
        await getPaginatedResorts(1, '', curParentIds).then(response => {
          const { totalRowCount, geographyViewModel } = response.data;
          setResortsList(geographyViewModel ?? []);

          const options = this.parseToImmutableOptions('resort', geographyViewModel, selectedItemIds);
          const filteredSelectedOptions = options.filter(opt => selectedItemIds.includes(opt.value));

          this.setState({
            dynamicOptions: options,
            totalOptionsCount: totalRowCount,
            hasNextPage: options.length < totalRowCount,
            loadingOptions: false,
            currentPageNo: 1,
            parentIds: curParentIds,
            searchText: '',
            selectedOptions: filteredSelectedOptions,
            cachedState: null
          });
        });
      } else if (
        this.isDynamicAccommEnabled() &&
        (!areArraysEqual(curParentIds, prevParentIds) || !areArraysEqual(currentContractTypes, prevContractTypes))
      ) {
        this.setState({ dynamicAccomFlag: LifeCycleStatus.DidUpdate });

        await getDynamicAccom(1, '', curParentIds, curSelectedItemsIds, currentContractTypes).then(response => {
          const { totalRowCount, geographyAccommodationViewModel } = response.data;

          setDynamicAccomm({
            dynamicAccommodationEnabled: dynamicAccommodation.get('dynamicAccommodationEnabled'),
            dynamicAccomList: geographyAccommodationViewModel ?? [],
            resetDynamicAccomList: true
          });

          const options = this.parseToImmutableOptions(
            'accommodationcode',
            geographyAccommodationViewModel,
            selectedItemIds
          );
          const filteredSelectedOptions = options.filter(opt => selectedItemIds.includes(opt.value));

          this.props.onChange(null, filteredSelectedOptions);

          this.setState({
            dynamicOptions: options,
            totalOptionsCount: totalRowCount,
            hasNextPage: options.length < totalRowCount,
            loadingOptions: false,
            currentPageNo: 1,
            parentIds: curParentIds,
            searchText: '',
            selectedOptions: filteredSelectedOptions,
            cachedState: null
          });
        });
      }
    }
  }

  handleChange = userSelectedItem => {
    const { selectedOptions } = this.state;

    if (!selectedOptions.find(item => item.value === userSelectedItem.value)) {
      this.setState({ selectedOptions: [...selectedOptions, userSelectedItem] });
    } else {
      this.setState({ selectedOptions: selectedOptions.filter(item => item.value !== userSelectedItem.value) });
    }

    this.props.onChange(userSelectedItem);
  };

  parseToImmutableOptions = (criteriaKey, optionsData = [], selectedItemIds = List()) => {
    const valueItems = optionsData.map(item =>
      createValueItem(
        item.id,
        item.name,
        item.code,
        item.parentIds,
        item.sourceMarketIds,
        item.parentCountryIds,
        item.parentDestinationIds
      )
    );

    return createCriteriaItem(criteriaKey, valueItems)
      .values.groupBy(item => item.get('id'))
      .map(item => item.first())
      .toList()
      .map(item => createFilterItem(item, selectedItemIds))
      .toArray();
  };

  calculateTruncatedWidth = width => {
    let truncate = 60;

    if (width) {
      truncate = Number(width.slice(0, -2)) * 0.6;
    }

    return truncate;
  };

  allOptionsLoaded = index => {
    const { dynamicOptions, hasNextPage } = this.state;
    return !hasNextPage || index < dynamicOptions.length;
  };

  paginateOptions = () => {
    const { loadingOptions, currentPageNo, totalOptionsCount, searchText, parentIds } = this.state;

    if (!loadingOptions) {
      this.setState({ loadingOptions: true }, () => {
        const newPage = currentPageNo + 1;

        if (this.props.placeholder === 'Resort') {
          getPaginatedResorts(newPage, searchText, parentIds).then(response => {
            const { geographyViewModel } = response.data;
            this.props.updateResortsList(geographyViewModel);
            this.setState(currState => {
              return {
                ...currState,
                dynamicOptions: [
                  ...currState.dynamicOptions,
                  ...this.parseToImmutableOptions('resort', geographyViewModel)
                ],
                currentPageNo: newPage,
                loadingOptions: false,
                hasNextPage: currState.dynamicOptions.length < totalOptionsCount
              };
            });
          });
        } else if (this.isDynamicAccommEnabled()) {
          const contractTypes = this.props.dynamicAccommodation.get('selectedContractTypes').toArray();
          getDynamicAccom(newPage, searchText, parentIds, [], contractTypes).then(response => {
            const { geographyAccommodationViewModel } = response.data;
            this.props.setDynamicAccomm({
              dynamicAccommodationEnabled: this.props.dynamicAccommodation.get('dynamicAccommodationEnabled'),
              dynamicAccomList: geographyAccommodationViewModel
            });

            this.setState(currState => {
              return {
                ...currState,
                dynamicOptions: [
                  ...currState.dynamicOptions,
                  ...this.parseToImmutableOptions('accommodationcode', geographyAccommodationViewModel)
                ],
                currentPageNo: newPage,
                loadingOptions: false,
                hasNextPage: currState.dynamicOptions.length < totalOptionsCount
              };
            });
          });
        }
      });
    }
  };

  renderOptions = (isOpen, filterItems, inputValue, getItemProps, markHits, highlightedIndex) => {
    if (isOpen) {
      if (this.props.placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
        const { totalOptionsCount, dynamicOptions } = this.state;

        const scrollOptionsCount =
          dynamicOptions.length < totalOptionsCount ? dynamicOptions.length + 1 : dynamicOptions.length;

        return (
          <InfiniteLoader
            isItemLoaded={this.allOptionsLoaded}
            itemCount={scrollOptionsCount}
            loadMoreItems={this.paginateOptions}
            minimumBatchSize={100}
          >
            {({ onItemsRendered, ref }) => {
              return (
                <FList
                  height={dynamicOptions.length ? 140 : 10}
                  itemCount={scrollOptionsCount}
                  itemSize={20}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  itemData={{
                    items: dynamicOptions,
                    inputValue,
                    getItemProps,
                    markHits,
                    highlightedIndex,
                    allOptionsLoaded: this.allOptionsLoaded
                  }}
                >
                  {ItemRenderer}
                </FList>
              );
            }}
          </InfiniteLoader>
        );
      } else {
        return filterItems(inputValue).map((item, index) => {
          return this.ItemBuilder(item, index, inputValue, getItemProps, markHits, highlightedIndex);
        });
      }
    } else {
      return null;
    }
  };

  ItemBuilder = (item, index, inputValue, getItemProps, markHits, highlightedIndex) => {
    return (
      <DropdownItem
        key={item.value}
        {...getItemProps({
          item,
          index,
          isActive: highlightedIndex === index,
          isSelected: item.isSelected
        })}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: markHits(item.label, inputValue)
          }}
        />
      </DropdownItem>
    );
  };

  queryHandler = async () => {
    const { searchText, selectedOptions, cachedState, parentIds } = this.state;

    if (searchText) {
      if (!cachedState) this.setState({ cachedState: { ...this.state, searchText: '' } });

      let options, totalRowCount;

      if (this.props.placeholder === 'Resort') {
        await getPaginatedResorts(1, searchText, parentIds).then(response => {
          const { totalRowCount: tRC, geographyViewModel } = response.data;
          this.props.updateResortsList(geographyViewModel ?? []);

          totalRowCount = tRC;
          options = this.parseToImmutableOptions('resort', geographyViewModel ?? []);
        });
      } else if (this.isDynamicAccommEnabled()) {
        const contractTypes = this.props.dynamicAccommodation.get('selectedContractTypes').toArray();
        const selectedDynamicOptions = selectedOptions.map(item => item.value);

        await getDynamicAccom(1, searchText, parentIds, selectedDynamicOptions, contractTypes).then(response => {
          const { totalRowCount: tRC, geographyAccommodationViewModel } = response.data;
          this.props.setDynamicAccomm({
            dynamicAccommodationEnabled: this.props.dynamicAccommodation.get('dynamicAccommodationEnabled'),
            dynamicAccomList: geographyAccommodationViewModel ?? []
          });

          totalRowCount = tRC;
          options = this.parseToImmutableOptions('accommodationcode', geographyAccommodationViewModel ?? []);
        });
      }

      this.setState({
        dynamicOptions: options,
        totalOptionsCount: totalRowCount,
        hasNextPage: options.length < totalRowCount,
        loadingOptions: false,
        currentPageNo: 1
      });
    } else if (cachedState) {
      this.setState({ ...cachedState, cachedState: null, selectedOptions: selectedOptions });
    }
  };

  queryBySearchText = (function (func, timer = 500) {
    let timerState;
    return () => {
      clearTimeout(timerState);
      timerState = setTimeout(func, timer);
    };
  })(this.queryHandler);

  getIconButton = () => {
    const { placeholder, allItemsSelected } = this.props;
    const { selectedOptions, dynamicOptions } = this.state;

    const getAddRemoveIcon = () => {
      if (placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
        return selectedOptions.length >= dynamicOptions.length ? (
          <RemoveIcon fontSize="inherit" />
        ) : (
          <AddIcon fontSize="inherit" />
        );
      } else {
        return allItemsSelected ? <RemoveIcon fontSize="inherit" /> : <AddIcon fontSize="inherit" />;
      }
    };

    return (
      <IconButton
        marginBottom="3px"
        onClick={() => {
          if (placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
            let dynamicSelectedItemsIds = List();

            if (selectedOptions.length >= dynamicOptions.length) {
              this.setState({ selectedOptions: [] });
            } else {
              const newSelectedItems = [
                ...selectedOptions,
                ...dynamicOptions.filter(item => !selectedOptions.some(innerItem => innerItem.value === item.value))
              ];
              this.setState({
                selectedOptions: newSelectedItems
              });
              dynamicSelectedItemsIds = List(newSelectedItems.map(item => item.value));
            }

            this.props.allItemsSelectedCB(dynamicSelectedItemsIds);
          } else {
            this.props.allItemsSelectedCB();
          }
        }}
      >
        {getAddRemoveIcon()}
      </IconButton>
    );
  };

  isDynamicAccommEnabled = () =>
    this.props.placeholder === 'Accommodation' && this.props.dynamicAccommodation.get('dynamicAccommodationEnabled');

  getOptionsData = () => {
    if (this.props.placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
      return this.state.dynamicOptions;
    }
    return this.props.data;
  };

  render() {
    return (
      <Flexbox alignItems="flex-end">
        <MultiDownshift
          onChange={this.handleChange}
          itemToString={() => ''}
          data={this.getOptionsData()}
          requireSelection={this.props.requireSelection}
          disabled={this.props.disabled}
          onInputValueChange={inputValue => {
            if (this.props.placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
              this.setState({ searchText: inputValue.trim() });
              this.queryBySearchText();
            }
          }}
        >
          {({
            getInputProps,
            getMenuProps,
            getRemoveButtonProps,
            filterItems,
            markHits,
            isOpen,
            inputValue,
            getSelectedItems,
            getItemProps,
            highlightedIndex,
            toggleMenu
          }) => {
            const selectedItems = getSelectedItems();
            const chips = [];

            const getChip = (item, index) => {
              return (
                <DropdownChip key={index} title={item.label}>
                  <DropdownChipLabel truncate={`${this.calculateTruncatedWidth(this.props.width)}px`}>
                    {item.label}
                  </DropdownChipLabel>
                  <DropdownChipRemoveButton {...getRemoveButtonProps({ item })}>
                    <Icon fontSize="inherit">cancel</Icon>
                  </DropdownChipRemoveButton>
                </DropdownChip>
              );
            };

            if (this.props.placeholder === 'Resort' || this.isDynamicAccommEnabled()) {
              const { selectedOptions: dynamicSelectedItems } = this.state;
              dynamicSelectedItems.forEach((item, index) => {
                chips.push(getChip(item, index));
              });
            } else {
              selectedItems.forEach((item, index) => {
                chips.push(getChip(item, index));
              });
            }

            return (
              <div>
                <DropdownContainer hasErrorMessage={!!this.props.errorMessage} {...this.props}>
                  <DropdownLabel>{this.props.placeholder}</DropdownLabel>
                  <DropdownHeader
                    disabled={this.props.disabled}
                    onClick={() => {
                      toggleMenu();
                      !isOpen && this.input.current.focus();
                    }}
                    isOpen={isOpen}
                  >
                    <DropdownHeaderContent>
                      {chips.length > 0 && chips[0]}

                      {chips.length > 1 && !isOpen && (
                        <DropdownChip key={'more'} title={'more'}>
                          <DropdownChipLabel>...</DropdownChipLabel>
                        </DropdownChip>
                      )}

                      <DropdownInput
                        {...getInputProps({
                          disabled: this.props.disabled,
                          ref: this.input,
                          placeholder: 'Please type',
                          size: '10'
                        })}
                      />
                    </DropdownHeaderContent>
                  </DropdownHeader>

                  <DropdownContent {...getMenuProps({ isOpen })}>
                    {chips.length > 0 && <DropdownChips>{chips.splice(1)}</DropdownChips>}
                    <Dropdown {...getMenuProps({ isOpen })}>
                      {this.renderOptions(isOpen, filterItems, inputValue, getItemProps, markHits, highlightedIndex)}
                    </Dropdown>
                  </DropdownContent>
                  <ErrorToolTip>{this.props.errorMessage}</ErrorToolTip>
                </DropdownContainer>
              </div>
            );
          }}
        </MultiDownshift>
        {this.getIconButton()}
      </Flexbox>
    );
  }
}

AutoCompleteMultiple.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  requireSelection: PropTypes.bool
};

PropTypes.defaultProps = {
  requireSelection: false
};

function mapStateToProps(state) {
  return {
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setResortsList: resorts => dispatch(appStateActions.setResortsList(resorts)),
    updateResortsList: resorts => dispatch(appStateActions.updateResortsList(resorts)),
    setDynamicAccomm: dynamicAccomState => dispatch(appStateActions.setDynamicAccommodation(dynamicAccomState))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteMultiple);

class ItemRenderer extends PureComponent {
  render() {
    const {
      data: { items, inputValue, getItemProps, markHits, highlightedIndex, allOptionsLoaded },
      index,
      style
    } = this.props;
    const item = items[index];

    if (!allOptionsLoaded(index)) {
      return <li style={style}>Loading....</li>;
    }
    return (
      <DropdownItem
        style={style}
        {...getItemProps({
          item,
          index,
          isActive: highlightedIndex === index,
          isSelected: item.isSelected
        })}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: markHits(item.label, inputValue)
          }}
        />
      </DropdownItem>
    );
  }
}
