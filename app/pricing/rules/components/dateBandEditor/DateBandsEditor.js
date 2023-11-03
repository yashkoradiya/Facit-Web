import React, { useState, useRef, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Clear } from '@material-ui/icons';
import { keys } from 'helpers/keyChecker';
import DateInput from 'components/FormFields/DateInput';
import { IconButton } from 'components/styled/Button';
import flattenDateBands from './utils/flattenDateBands';
import unflattenDateBands from './utils/unflattenDateBands';
import createDefaultFlatDateBand from './utils/createDefaultFlatDateBand';
import { updateDateBandValue, updateDateBandsWithDuration, getColumnValueByKey } from './utils/updateDateBands';
import * as dateBandHelper from '../dateBandHelper';
import './dateBand.css';
import * as dateBandValidator from './dateBandValidator';
import DateBandValueInput from './DateBandValueInput';
import { ruleTypes } from 'pricing/rules/ruleConstants';

const pressedKeys = {};

const createData = (dateBands, durationGroups, valueDefinitions) => {
  const flatDateBands = flattenDateBands(dateBands);

  const newDateBand = createDefaultFlatDateBand(durationGroups, valueDefinitions, null);
  flatDateBands.push(newDateBand);

  return flatDateBands;
};

export default function DateBandsEditor({
  dateBands,
  durationGroups,
  valueDefinitions,
  onChange,
  currency,
  validationMessages,
  disabled,
  disableFocus,
  ruleType
}) {
  const [data, setData] = useState([]);
  const theListRef = useRef(React.createRef());

  useEffect(() => {
    createInitialData();
  }, [createInitialData]);

  const createInitialData = useCallback(() => {
    const flatDateBands = createData(dateBands, durationGroups, valueDefinitions);
    setData(flatDateBands);
  }, [dateBands, durationGroups, valueDefinitions]);

  useEffect(() => {
    if (data.length > 0) {
      const updatedData = updateDateBandsWithDuration(data, durationGroups);
      //  const messages = dateBandValidator.validateEverything(updatedData, {}, valueDefinitions);
      setData(updatedData);
      const unflatDateBands = unflattenDateBands(updatedData, durationGroups);
      onChange(unflatDateBands, validationMessages);
    }
    // We shouldn't rerun this when data changes, but eslint wants it as a dependency.
    // Can probably be refactored to avoid disabling.
    // eslint-disable-next-line
  }, [durationGroups, onChange]);

  const isValueExistInDestinationCol = dataset => {
    let isValueExist = true;
    let isMinMaxTemplate = false;

    if (valueDefinitions[0].title === 'Adult Min' && getTemplateType() === 'MinThreshold') {
      isMinMaxTemplate = true;
    }

    if (dataset.colindex == '5' && isMinMaxTemplate === true) {
      var inputControlToBeUpdated = 'input[data-colindex="7"][data-rowindex="' + dataset.rowindex + '"]';
      var targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
      var valueToBeCompared = targetControl[0].value;
      if (valueToBeCompared == null || valueToBeCompared == '') {
        isValueExist = false;
      }
    } else if (dataset.colindex == '6' && isMinMaxTemplate === true) {
      inputControlToBeUpdated = 'input[data-colindex="8"][data-rowindex="' + dataset.rowindex + '"]';
      targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
      valueToBeCompared = targetControl[0].value;
      if (valueToBeCompared == null || valueToBeCompared == '') {
        isValueExist = false;
      }
    } else if (dataset.colindex == '6' && isMinMaxTemplate === false) {
      inputControlToBeUpdated = 'input[data-colindex="9"][data-rowindex="' + dataset.rowindex + '"]';
      targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
      valueToBeCompared = targetControl[0].value;
      if (valueToBeCompared == null || valueToBeCompared == '') {
        isValueExist = false;
      }
    } else if (dataset.colindex == '7') {
      inputControlToBeUpdated = 'input[data-colindex="10"][data-rowindex="' + dataset.rowindex + '"]';
      targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
      valueToBeCompared = targetControl[0].value;
      if (valueToBeCompared == null || valueToBeCompared == '') {
        isValueExist = false;
      }
    } else if (dataset.colindex == '8') {
      inputControlToBeUpdated = 'input[data-colindex="11"][data-rowindex="' + dataset.rowindex + '"]';
      targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
      valueToBeCompared = targetControl[0].value;
      if (valueToBeCompared == null || valueToBeCompared == '') {
        isValueExist = false;
      }
    }
    return isValueExist;
  };

  //This will return the source column value e.g. 'Child1' value
  const getSourceColumnValue = (dataset, value, data) => {
    let sourceColumnValue = '';
    const dataResult = getColumnValueByKey(dataset.datebandkey, dataset.propertyname, value, data);

    if (dataResult != undefined) {
      var dataCol = dataResult[0];
      sourceColumnValue = dataCol[dataset.propertyname];
    }
    return sourceColumnValue;
  };
  const isSourceColumnValueModified = (oldValue, newValue) => {
    if (oldValue == newValue) return false;
    else return true;
  };
  const getTemplateType = () => {
    var templateDefiintion = valueDefinitions[0].valueType;
    return templateDefiintion;
  };
  const handleInputOnBlur = ({ dataset, value }) => {
    let columnIndexToBeCopied = ['6', '7', '8']; //Child1-Min-Max
    let isMinMaxTemplate = false;
    if (getTemplateType() === 'Absolute') {
      columnIndexToBeCopied = ['4']; //Child1
    } else if (getTemplateType() === 'Percentage') {
      columnIndexToBeCopied = ['6', '7', '8']; //Child1-Min-Max
    } else {
      if (valueDefinitions[0].title === 'Adult Min' && getTemplateType() === 'MinThreshold') {
        columnIndexToBeCopied = ['5', '6']; //Min/Max Template
        isMinMaxTemplate = true;
      }
    }
    var isTargetValueExistAndSame = true,
      isUpdated = false;

    if (columnIndexToBeCopied.indexOf(dataset.colindex) != -1) {
      //Get the column value from array and compare with the new value
      var sourceColumnValueToBeCompared = getSourceColumnValue(dataset, value, data);
      isUpdated = isSourceColumnValueModified(sourceColumnValueToBeCompared, value);
      isTargetValueExistAndSame = isValueExistInDestinationCol(dataset, value);
    }

    var updatedData = updateDateBandValue(dataset.datebandkey, dataset.propertyname, value, data);
    setData(updatedData);
    const validatedValueMessages = validateCell(dataset.datebandkey, dataset.propertyname, value);

    if (isTargetValueExistAndSame === false || isUpdated == true) {
      if (dataset.colindex == '4') {
        var inputControlToBeSelected = 'input[data-colindex="4"][data-rowindex="' + dataset.rowindex + '"]';
        var inputControlToBeUpdated = 'input[data-colindex="5"][data-rowindex="' + dataset.rowindex + '"]';
        var elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        var targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);

        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 5);
      } else if (dataset.colindex == '5') {
        inputControlToBeSelected = 'input[data-colindex="5"][data-rowindex="' + dataset.rowindex + '"]';
        inputControlToBeUpdated = 'input[data-colindex="7"][data-rowindex="' + dataset.rowindex + '"]';
        elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);

        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 9);
      } else if (dataset.colindex == '6' && isMinMaxTemplate === true) {
        inputControlToBeSelected = 'input[data-colindex="6"][data-rowindex="' + dataset.rowindex + '"]';
        inputControlToBeUpdated = 'input[data-colindex="8"][data-rowindex="' + dataset.rowindex + '"]';
        elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);

        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 9);
      } else if (dataset.colindex == '6' && isMinMaxTemplate === false) {
        inputControlToBeSelected = 'input[data-colindex="6"][data-rowindex="' + dataset.rowindex + '"]';
        inputControlToBeUpdated = 'input[data-colindex="9"][data-rowindex="' + dataset.rowindex + '"]';
        elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);

        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 9);
      } else if (dataset.colindex == '7') {
        inputControlToBeSelected = 'input[data-colindex="7"][data-rowindex="' + dataset.rowindex + '"]';
        inputControlToBeUpdated = 'input[data-colindex="10"][data-rowindex="' + dataset.rowindex + '"]';
        elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 10);
      } else if (dataset.colindex == '8') {
        inputControlToBeSelected = 'input[data-colindex="8"][data-rowindex="' + dataset.rowindex + '"]';
        inputControlToBeUpdated = 'input[data-colindex="11"][data-rowindex="' + dataset.rowindex + '"]';
        elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
        targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
        targetControl[0].defaultValue = elements[0].value;
        targetControl[0].value = elements[0].value;
        updatedData = updatedData.map(d =>
          d.key === dataset.datebandkey
            ? { ...d, [targetControl[0].dataset.propertyname]: d[elements[0].dataset.propertyname] }
            : d
        );
        setData(updatedData);
        updateChildProps(dataset.rowindex, dataset.colindex, 11);
      }
    }
    const unflatDateBands = unflattenDateBands(updatedData, durationGroups);
    onChange(unflatDateBands, validatedValueMessages);
  };

  const validateCell = (dateBandKey, propertyName, value) => {
    const currentDateBand = data.find(x => x.key === dateBandKey);
    if (currentDateBand.isNewDateBand) {
      return validationMessages;
    }
    return dateBandValidator.validateValue(currentDateBand, validationMessages, valueDefinitions, propertyName, value);
  };

  const handleDateChange = (dateBandKey, propertyName, selectedDate) => {
    if (selectedDate === null) return;
    let updatedData = updateDateBandValue(dateBandKey, propertyName, selectedDate, data);

    const currentDateBand = updatedData.find(x => x.key === dateBandKey);
    if (currentDateBand.isNewDateBand && currentDateBand.from && currentDateBand.to) {
      updatedData = updateDateBandValue(currentDateBand.key, 'isNewDateBand', false, updatedData);

      const newDateBand = createDefaultFlatDateBand(durationGroups, valueDefinitions);
      updatedData.push(newDateBand);
    }

    setData(updatedData);
  };

  const handleBlurDateInput = (dateBand, propertyName, event) => {
    if (dateBand.from && dateBand.to) {
      if (!dateBand.from.isSameOrBefore(dateBand.to)) {
        const [mergedDateBands] = dateBandHelper.handleNestedDateBands(
          dateBand,
          data.filter(x => !x.isNewDateBand)
        );
        const unflatDateBands = unflattenDateBands(mergedDateBands, durationGroups);
        onChange(unflatDateBands, {
          ...validationMessages,
          [`${dateBand.key}_to`]: 'Is same or before'
        });
        return;
      }

      let updatedValidationMessages = dateBandValidator.validateDate(propertyName, dateBand, validationMessages);

      const [mergedDateBands] = dateBandHelper.handleNestedDateBands(
        dateBand,
        data.filter(x => !x.isNewDateBand)
      );

      //TODO refactor this
      updatedValidationMessages = dateBandValidator.validateDateBandGaps(dateBand, mergedDateBands, false, {
        ...updatedValidationMessages
      });
      updatedValidationMessages = dateBandValidator.validateDateBandGaps(dateBand, mergedDateBands, true, {
        ...updatedValidationMessages
      });

      setData([...mergedDateBands, data.find(x => x.isNewDateBand)]);
      const unflatDateBands = unflattenDateBands(mergedDateBands, durationGroups);
      onChange(unflatDateBands, updatedValidationMessages);
    }

    if (event.relatedTarget === null && !disableFocus) {
      moveFocus(
        keys.arrowRight,
        keys.arrowRight,
        keys.arrowLeft,
        'input[data-rowindex="' + event.target.dataset.rowindex + '"]',
        `${dateBand.key}_${propertyName}`
      );
    }
  };

  const handleKeyDown = event => {
    const { keyCode, target } = event;
    pressedKeys[keyCode] = true;

    const { colindex, rowindex } = target.dataset;

    if (keyCode === keys.arrowDown || keyCode === keys.arrowUp || keyCode === keys.enter) {
      moveFocus(keyCode, keys.arrowDown, keys.arrowUp, 'input[data-colindex="' + colindex + '"]', target.id);
    }

    if (keyCode === keys.arrowLeft || keyCode === keys.arrowRight) {
      moveFocus(keyCode, keys.arrowRight, keys.arrowLeft, 'input[data-rowindex="' + rowindex + '"]', target.id);
    }
  };

  const updateChildProps = (rowIndexToBeSearched, colIndexToBeSearched, colIndexToBeCopied) => {
    var inputControlToBeSelected =
      'input[data-colindex="' + colIndexToBeSearched + '"][data-rowindex="' + rowIndexToBeSearched + '"]';
    var inputControlToBeUpdated =
      'input[data-colindex="' + colIndexToBeCopied + '"][data-rowindex="' + rowIndexToBeSearched + '"]';
    var elements = theListRef.current.querySelectorAll(inputControlToBeSelected);
    var targetControl = theListRef.current.querySelectorAll(inputControlToBeUpdated);
    targetControl[0].defaultValue = elements[0].value;
    targetControl[0].value = elements[0].value;
  };
  const moveFocus = (keyCode, nextKeyCode, prevKeyCode, querySelector, id) => {
    const elements = theListRef.current.querySelectorAll(querySelector);
    const currentIndex = getCurrentIndex(elements, id);

    if (keyCode === nextKeyCode || keyCode === keys.enter) focusOnNext(elements, currentIndex);
    if (keyCode === prevKeyCode) focusOnPrevious(elements, currentIndex);
  };

  const focusOnPrevious = (elements, currentIndex) => {
    if (currentIndex - 1 >= 0) {
      elements[currentIndex - 1].focus();
    }
  };

  const focusOnNext = (elements, currentIndex) => {
    if (currentIndex + 1 < elements.length) {
      elements[currentIndex + 1].focus();
    }
  };

  const handleKeyUp = ({ keyCode }) => {
    pressedKeys[keyCode] = false;
  };

  const handleDelete = key => {
    const updatedData = data.filter(item => item.key !== key);
    const updatedValidationMessages = dateBandValidator.validateEverything(updatedData, {}, valueDefinitions);

    setData(updatedData);
    const unflatDateBands = unflattenDateBands(updatedData, durationGroups);
    onChange(unflatDateBands, updatedValidationMessages);
  };

  const hasDurationGroups = durationGroup => {
    return durationGroup && durationGroups.length > 0;
  };

  let rowCount = 0;

  let errorClassDateBands = {};
  Object.keys(validationMessages).forEach(x => {
    errorClassDateBands[x] = 'dateband-cell-error';
  });

  const shouldDisable = defIdx => {
    if (ruleType === ruleTypes.boardUpgrade) {
      switch (getTemplateType()) {
        case 'Absolute':
          return defIdx === 2;
        case 'Percentage':
          return [6, 7, 8].includes(defIdx);
      }
    }
    return disabled;
  };

  return (
    <div className="the-list" ref={theListRef}>
      <table cellSpacing="0" cellPadding="0" className="dateband-main">
        {data.length > 0 && (
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              {!hasDurationGroups(durationGroups) &&
                valueDefinitions.map((v, i) => (
                  <th key={i}>{`${v.title}${v.valueType === 'Percentage' ? ' (%)' : ` (${currency})`}`}</th>
                ))}
              {hasDurationGroups(durationGroups) && <th className="empty-cell" />}
              {!disabled && <th className="empty-cell" />}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((flatDateBand, index) => {
            const rowIndex = rowCount + 1;
            return (
              <tr key={flatDateBand.key}>
                <td className="date-cell input-placeholder">
                  <DateInput
                    disabled={disabled}
                    selected={flatDateBand.from}
                    openToDate={getNextSuggestedDate(flatDateBand.from, data[index - 1] ? data[index - 1].to : null)}
                    inputId={`${flatDateBand.key}_from`}
                    onChange={selectedDate => handleDateChange(flatDateBand.key, 'from', selectedDate)}
                    onBlur={e => handleBlurDateInput(flatDateBand, 'from', e)}
                    customInputAttributes={{
                      'data-colindex': 1,
                      'data-rowindex': rowIndex,
                      'data-datebandkey': flatDateBand.key,
                      'data-propertyname': 'from'
                    }}
                    errorClass={errorClassDateBands[`${flatDateBand.key}_from`]}
                    inputHeight="26px"
                    inputBorder="none"
                    placeholderText={flatDateBand.isNewDateBand ? 'Add date band +' : null}
                  />
                </td>
                <td className="date-cell">
                  <DateInput
                    disabled={disabled}
                    selected={flatDateBand.to}
                    openToDate={getNextSuggestedDate(flatDateBand.to, flatDateBand.from)}
                    inputId={`${flatDateBand.key}_to`}
                    onChange={selectedDate => handleDateChange(flatDateBand.key, 'to', selectedDate)}
                    onBlur={e => handleBlurDateInput(flatDateBand, 'to', e)}
                    customInputAttributes={{
                      'data-colindex': 2,
                      'data-rowindex': rowIndex,
                      'data-datebandkey': flatDateBand.key,
                      'data-propertyname': 'to'
                    }}
                    errorClass={errorClassDateBands[`${flatDateBand.key}_to`]}
                    inputHeight="26px"
                    inputBorder="none"
                  />
                </td>
                {hasDurationGroups(durationGroups) && (
                  <td
                    style={{
                      padding: 0,
                      borderLeft: 'none',
                      borderRight: 'none'
                    }}
                  >
                    <table className="dateband-durations" style={{ marginTop: index === 0 ? '-32px' : 0 }}>
                      {index === 0 && (
                        <thead>
                          <tr>
                            <th>Duration</th>
                            {valueDefinitions.map((v, i) => (
                              <th key={i}>{`${v.title}${v.valueType === 'Percentage' ? ' (%)' : ` (${currency})`}`}</th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {durationGroups
                          .sort((a, b) => a.from - b.from)
                          .map(duration => {
                            rowCount++;
                            return (
                              <tr key={duration.key}>
                                <td className="duration-group">{`${duration.from}-${duration.to}`}</td>
                                {valueDefinitions.map((definition, definitionIndex) => {
                                  const propertyName = `${duration.key}_${definition.id}`;
                                  return (
                                    <td key={definitionIndex}>
                                      <DateBandValueInput
                                        disabled={disabled}
                                        className={errorClassDateBands[`${flatDateBand.key}_${propertyName}`]}
                                        flatDateBand={flatDateBand}
                                        propertyName={propertyName}
                                        onKeyDown={handleKeyDown}
                                        onKeyUp={handleKeyUp}
                                        onBlur={handleInputOnBlur}
                                        colIndex={3 + definitionIndex}
                                        rowIndex={rowCount}
                                        valueType={definition.valueType}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </td>
                )}
                {!hasDurationGroups(durationGroups) &&
                  valueDefinitions.map((definition, definitionIndex) => {
                    const propertyName = `${definition.id}`;
                    return (
                      <td className="date-cell" key={definitionIndex}>
                        <DateBandValueInput
                          disabled={shouldDisable(definitionIndex)}
                          className={errorClassDateBands[`${flatDateBand.key}_${propertyName}`]}
                          flatDateBand={flatDateBand}
                          propertyName={propertyName}
                          onKeyDown={handleKeyDown}
                          onKeyUp={handleKeyUp}
                          onBlur={handleInputOnBlur}
                          colIndex={3 + definitionIndex}
                          rowIndex={rowIndex}
                          valueType={definition.valueType}
                        />
                      </td>
                    );
                  })}
                {!disabled && (
                  <td className="date-cell">
                    {!flatDateBand.isNewDateBand && (
                      <IconButton
                        fontSize="16px"
                        marginLeft="7px"
                        marginRight="7px"
                        onClick={() => handleDelete(flatDateBand.key)}
                      >
                        <Clear fontSize="inherit" />
                      </IconButton>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const getNextSuggestedDate = (selectedValue, previousDateValue) => {
  return moment(selectedValue).isValid()
    ? moment(selectedValue)
    : previousDateValue && moment(previousDateValue).isValid()
    ? moment(previousDateValue).clone().add(1, 'days')
    : null;
};

const getCurrentIndex = (elements, id) => {
  let index = 0;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};
