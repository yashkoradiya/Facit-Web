import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import { Flexbox, ErrorToolTip } from '../../../components/styled/Layout';
import DateInput from '../../../components/FormFields/DateInput';
import { InputBox, InputLabel } from '../../../components/styled/Input';
import { PrimaryButton, IconButton } from '../../../components/styled/Button';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import SearchBox from '../../../components/FormFields/SearchBox';

class DateRangeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationMessages: {},
      selectedFrom: null,
      selectedTo: null,
      selectedSingle: null,
      selectedWeekdays: List(),
      isAllDatesSelected: false,
      weekdays: fromJS([
        { id: 'Mo', name: '1 - Mo' },
        { id: 'Tu', name: '2 - Tu' },
        { id: 'We', name: '3 - We' },
        { id: 'Th', name: '4 - Th' },
        { id: 'Fr', name: '5 - Fr' },
        { id: 'Sa', name: '6 - Sa' },
        { id: 'Su', name: '7 - Su' }
      ])
    };
  }

  clearValidation = field => {
    const { validationMessages } = this.state;
    delete validationMessages[field];
    this.setState({
      validationMessages
    });
  };

  handleFromDateChange = date => {
    date = this.isValidDate(date) ? date : null;
    this.clearValidation('from');
    this.setState({ selectedFrom: date });
  };

  handleToDateChange = date => {
    date = this.isValidDate(date) ? date : null;

    this.clearValidation('to');
    this.setState({ selectedTo: date });
  };

  handleSingleDateChange = date => {
    date = this.isValidDate(date) ? date : null;

    this.clearValidation('single');
    this.setState({ selectedSingle: date });
  };

  isValidDate = date => {
    if (!date) return false;
    date = !moment.isMoment(date) ? moment(date) : date;
    return date.isValid();
  };

  validateDateRangeInput = () => {
    const { validationMessages } = this.state;
    let updatedValidationMessages = validationMessages;
    if (!this.isValidDate(this.state.selectedTo)) {
      updatedValidationMessages = {
        ...updatedValidationMessages,
        to: 'Invalid to date'
      };
    }

    if (!this.isValidDate(this.state.selectedFrom)) {
      updatedValidationMessages = {
        ...updatedValidationMessages,
        from: 'Invalid from date'
      };
    }

    this.setState({
      validationMessages: updatedValidationMessages
    });

    return updatedValidationMessages;
  };

  validateSingleDateInput = () => {
    const { validationMessages } = this.state;
    let updatedValidationMessages = validationMessages;
    if (!this.isValidDate(this.state.selectedSingle)) {
      updatedValidationMessages = {
        ...updatedValidationMessages,
        single: 'Invalid date'
      };
    }

    this.setState({
      validationMessages: updatedValidationMessages
    });

    return updatedValidationMessages;
  };

  addDates = () => {
    const { selectedFrom, selectedTo, selectedSingle, selectedWeekdays } = this.state;

    const selectedDateRanges = [];

    if (!selectedFrom && !selectedTo && !selectedSingle) {
      this.validateDateRangeInput();
      return;
    }

    if (selectedFrom || selectedTo) {
      const validationMessages = this.validateDateRangeInput();
      if (validationMessages.from || validationMessages.to) return;

      selectedDateRanges.push({
        from: selectedFrom.toDate(),
        to: selectedTo.toDate()
      });
    }
    if (selectedSingle) {
      const validationMessages = this.validateSingleDateInput();
      if (validationMessages.single) return;

      selectedDateRanges.push({
        from: selectedSingle.toDate(),
        to: selectedSingle.toDate()
      });
    }

    this.setState(
      {
        selectedFrom: null,
        selectedTo: null,
        selectedSingle: null,
        selectedWeekdays: List(),
        isAllDatesSelected: false
      },
      () => {
        this.props.onDateRangeSelected(selectedDateRanges, selectedWeekdays);
      }
    );
  };

  handleSelectedWeekday = selectedWeekdays => {
    this.setState({ selectedWeekdays });
  };

  handleSelectAllDates = () => {
    const { isAllDatesSelected } = this.state;
    const { minDate, maxDate } = this.props;

    this.setState({
      selectedFrom: !isAllDatesSelected ? minDate : null,
      selectedTo: !isAllDatesSelected ? maxDate : null,
      isAllDatesSelected: !isAllDatesSelected,
      validationMessages: {}
    });
  };

  render() {
    const { validationMessages, weekdays, isAllDatesSelected } = this.state;
    const { minDate, maxDate, pageType } = this.props;
    return (
      <Flexbox alignItems="flex-end" data-testid="date-range-selector">
        <InputBox width="80px" marginRight="10px" hasErrorMessage={validationMessages && validationMessages.from}>
          <InputLabel>Period from</InputLabel>
          <DateInput
            key="from"
            minDate={minDate}
            maxDate={this.state.selectedTo || maxDate}
            selected={this.state.selectedFrom}
            onChange={this.handleFromDateChange}
          />
          <ErrorToolTip>{validationMessages && validationMessages.from}</ErrorToolTip>
        </InputBox>
        <InputBox width="80px" hasErrorMessage={validationMessages && validationMessages.to}>
          <InputLabel>Period to</InputLabel>
          <Flexbox>
            <DateInput
              inputId="toDateInputId"
              key="to"
              minDate={this.state.selectedFrom || minDate}
              maxDate={maxDate}
              Period
              selected={this.state.selectedTo}
              onChange={this.handleToDateChange}
            />
          </Flexbox>
          <ErrorToolTip>{validationMessages && validationMessages.to}</ErrorToolTip>
        </InputBox>
        <IconButton marginBottom="3px" marginRight="30px" onClick={this.handleSelectAllDates}>
          {isAllDatesSelected ? <RemoveIcon fontSize="inherit" /> : <AddIcon fontSize="inherit" />}
        </IconButton>
        {!['charter-flight-details', 'transfer-price-details'].includes(pageType) && (
          <Flexbox marginRight="30px">
            <SearchBox
              width="80px"
              items={weekdays}
              selectedItemIds={this.state.selectedWeekdays}
              onChange={this.handleSelectedWeekday}
              placeholder="Weekday"
            />
          </Flexbox>
        )}
        <InputBox width="80px" marginRight="30px" hasErrorMessage={validationMessages && validationMessages.single}>
          <InputLabel>Date</InputLabel>
          <Flexbox>
            <DateInput
              inputId="singleDateInputId"
              key="single"
              minDate={minDate}
              maxDate={maxDate}
              selected={this.state.selectedSingle}
              onChange={this.handleSingleDateChange}
            />
          </Flexbox>
          <ErrorToolTip>{validationMessages && validationMessages.single}</ErrorToolTip>
        </InputBox>
        <PrimaryButton marginRight="10px" onClick={this.addDates}>
          Show price details
        </PrimaryButton>
      </Flexbox>
    );
  }
}

DateRangeSelector.propTypes = {
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  onDateRangeSelected: PropTypes.func.isRequired
};

export default DateRangeSelector;
