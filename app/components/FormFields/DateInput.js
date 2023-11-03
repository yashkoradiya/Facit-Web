import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { Input } from '../styled/Input';
import { getDateFormat } from '../../helpers/dateHelper';

class DateInput extends Component {
  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.storeInputTextToState = this.storeInputTextToState.bind(this);
    this.getDateFormatList = this.getDateFormatList.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.datePickerRef = React.createRef();

    this.state = {
      date: props.selected,
      inputText: props.selected ? props.selected.format(getDateFormat()) : props.defaultRawValue
    };
  }

  static getDerivedStateFromProps(nextProps, previousState) {
    if (nextProps.selected !== previousState.date) {
      return {
        date: nextProps.selected,
        inputText: nextProps.selected ? nextProps.selected.format(getDateFormat()) : ''
      };
    }
    return null;
  }

  handleBlur(event) {
    if (!event) return;
    let parsedDate = moment(this.state.inputText, this.getDateFormatList());
    this.handleChange(parsedDate.isValid() ? parsedDate : null);
    this.props.onBlur(event);
  }

  storeInputTextToState({ target }) {
    let value = target.value;

    if (!value) return;
    let parsedDate = moment(value, this.getDateFormatList());
    this.handleChange(parsedDate.isValid() ? parsedDate : null);

    this.setState({
      inputText: value
    });
  }

  handleChange(date) {
    this.setState({ inputText: '' });
    this.props.onChange(date);
  }

  getDateFormatList() {
    return [getDateFormat(0), getDateFormat(), getDateFormat(2), getDateFormat(1)];
  }

  async handleOnFocus() {
    const node = this.datePickerRef;

    const { openToDate } = this.props;
    if (openToDate) {
      //This await actually works so leave it
      await this.storeInputTextToState({ target: { value: openToDate } });
    }
    node.current.input.select();
  }

  render() {
    const {
      minDate,
      maxDate,
      popupPosition,
      inputId,
      inputWidth,
      inputHeight,
      inputBorder,
      disabled,
      openToDate,
      customInputAttributes,
      placeholderText,
      errorClass
    } = this.props;

    return (
      <DatePicker
        className={errorClass}
        customInput={
          <Input
            disabled={disabled}
            style={{
              display: 'inline-block',
              width: inputWidth,
              height: inputHeight,
              borderColor: disabled ? 'transparent' : ''
            }}
            data-id={inputId}
            border={inputBorder}
            {...customInputAttributes}
          />
        }
        openToDate={openToDate}
        value={this.state.date ? undefined : this.props.defaultRawValue}
        ref={this.datePickerRef}
        selected={this.state.date}
        onChange={this.handleChange}
        onChangeRaw={this.storeInputTextToState}
        onBlur={this.handleBlur}
        onFocus={this.handleOnFocus}
        showMonthDropdown={true}
        showYearDropdown={true}
        dateFormat={getDateFormat()}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        disabledKeyboardNavigation={true}
        popperPlacement={popupPosition ? popupPosition : 'bottom'}
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '45px, 10px'
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
            boundariesElement: 'viewport'
          }
        }}
        calendarClassName="facit-calendar"
        placeholderText={placeholderText}
        id={inputId}
        locale="en-gb" // used to start week on Monday (CFD-1132)
      />
    );
  }
}

DateInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  selected: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  popupPosition: PropTypes.string,
  inputId: PropTypes.string,
  openToDate: PropTypes.any,
  placeholderText: PropTypes.string,
  errorClass: PropTypes.string
};

DateInput.defaultProps = {
  onBlur: () => {}
};

export default DateInput;
